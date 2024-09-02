import React from 'react';
import Image from 'next/image';

import { PlayIcon } from 'lucide-react';

import vids from '@/db/videos.json';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { readWorkoutCsv } from '@/lib/getWorkout';

const videos = vids as {
  [key: string]: string;
};

const Page = async () => {
  const allWorkouts = await readWorkoutCsv(process.cwd() + '/src/db/plan.csv');
  const workouts = allWorkouts.filter((w) => w.day_id === 3);

  return (
    <div>
      Hi!
      <div>
        {workouts.map((w, idx) => {
          const videoUrl = videos[w.exercise];

          const sub1VideoUrl: string | null = w.substitutionOption1
            ? videos[w.substitutionOption1]
            : null;
          const sub2VideoUrl: string | null = w.substitutionOption2
            ? videos[w.substitutionOption2]
            : null;

          return (
            <div
              key={idx}
              className="flex gap-8 px-4 py-12 odd:flex-row-reverse"
            >
              <div className="w-96 flex-none">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex aspect-video w-full flex-none overflow-hidden rounded-lg border"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${videoUrl.slice(17, 28)}/sddefault.jpg`}
                    alt="Youtube video"
                    width={420}
                    height={315}
                    quality={100}
                    className="z-0 -my-10"
                  />
                  <div className="group absolute inset-0 z-10 flex items-center justify-center transition-colors hover:bg-black/60">
                    <PlayIcon
                      className="size-12 opacity-0 transition-opacity group-hover:opacity-100"
                      fill="currentColor"
                    />
                  </div>
                </a>
                <div className="mt-2 grid grid-cols-1 gap-1">
                  {w.substitutionOption1 && sub1VideoUrl && (
                    <div className="relative flex">
                      <div className="flex w-24 flex-none items-center rounded-l bg-foreground px-2 font-semibold italic text-background">
                        Option 1
                      </div>
                      <div className="flex grow items-center rounded-r border border-l-0 px-4 font-bold">
                        {w.substitutionOption1}
                      </div>
                      <a
                        href={sub1VideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10 text-transparent"
                      ></a>
                    </div>
                  )}
                  {w.substitutionOption2 && sub2VideoUrl && (
                    <div className="relative flex">
                      <div className="flex w-24 flex-none items-center rounded-l bg-foreground px-2 font-semibold italic text-background">
                        Option 2
                      </div>
                      <div className="flex grow items-center rounded-r border border-l-0 px-4 font-bold">
                        {w.substitutionOption2}
                      </div>
                      <a
                        href={sub2VideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10 text-transparent"
                      ></a>
                    </div>
                  )}
                </div>
              </div>
              <div className="grow">
                <h2 className="text-4xl font-black">{w.exercise}</h2>
                <p className="text-muted-foreground">{w.notes}</p>

                <div>
                  {w.maxWarmUpSets === w.minWarmUpSets
                    ? `${w.minWarmUpSets} warmup sets`
                    : `${w.minWarmUpSets} - ${w.maxWarmUpSets} warmup sets`}
                </div>

                
                <div>
                  {w.maxRPE === w.minRPE
                    ? `${w.minRPE} RPE`
                    : `${w.minRPE} - ${w.maxRPE} RPE`}
                </div>

                <div className="my-2 grid grid-cols-3 gap-4">
                  <Label>Load (kg)</Label>
                  <Label>{w.hold ? 'Hold' : 'Reps'}</Label>
                  <Label>RPE</Label>
                  {Array.from(Array(w.workingSets).keys()).map((x) => (
                    <React.Fragment key={x}>
                      <Input placeholder="Load" disabled={w.hold} />
                      <Input
                        placeholder={
                          ((
                            w as unknown as {
                              [key: string]: string;
                            }
                          )[`repsWorkingSet${x + 1}` as string] as
                            | string
                            | undefined) ||
                          (w.minReps
                            ? `${w.minReps} - ${w.maxReps}`
                            : w.amrap
                              ? 'AMRAP'
                              : w.timeSeconds
                                ? `${w.timeSeconds}s`
                                : '')
                        }
                      />
                      <Input placeholder="RPE" />

                      <div className="col-span-3 text-center text-muted-foreground">
                        {w.maxRestMinutes === w.minRestMinutes
                          ? `${w.minRestMinutes} min rest`
                          : `${w.minRestMinutes} - ${w.maxRestMinutes} min rest`}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
