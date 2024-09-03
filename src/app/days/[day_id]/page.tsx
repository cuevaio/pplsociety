import React from 'react';
import Image from 'next/image';

import { PlayIcon } from 'lucide-react';

import plan from '@/db/plan.json';
import vids from '@/db/videos.json';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60000;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  return Array.from(Array(78).keys()).map((x) => ({
    day_id: (x + 1).toString(),
  }));
}

const videos = vids as {
  [key: string]: string;
};

function parseRange(min: number | null, max: number | null, unit?: string) {
  let base = '';
  if (min === null || max === null) {
    return undefined;
  } else if (min === max) {
    base = min.toString();
  } else {
    base = `${min} - ${max}`;
  }

  if (unit) {
    base += ' ' + unit;
  }

  return base;
}

const Page = async ({
  params,
}: {
  params: {
    day_id: string;
  };
}) => {
  const workouts = plan.filter((w) => w.day_id === parseInt(params.day_id));

  return (
    <div>
      <h1 className="text-3xl font-black sm:text-5xl">{workouts[0].day}</h1>
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
              className="my-12 flex flex-col gap-4 sm:my-24 sm:flex-row sm:gap-8 sm:odd:flex-row-reverse"
            >
              <div className="grow">
                <h2 className="text-2xl font-black sm:text-4xl">
                  {w.exercise}
                </h2>
                <p className="text-muted-foreground">{w.notes}</p>

                <div>
                  {parseRange(w.minWarmUpSets, w.maxWarmUpSets, 'warmup sets')}
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
                          parseRange(w.minReps, w.maxReps) ||
                          (w.amrap
                            ? 'AMRAP'
                            : w.timeSeconds
                              ? `${w.timeSeconds}s`
                              : '')
                        }
                      />
                      <Input placeholder={parseRange(w.minRPE, w.maxRPE)} />

                      <div className="col-span-3 text-center text-muted-foreground">
                        {parseRange(
                          w.maxRestMinutes,
                          w.minRestMinutes,
                          'min rest',
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="w-full flex-none sm:w-96">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex aspect-video w-full flex-none overflow-hidden rounded border"
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
                      <div className="flex w-8 flex-none items-center justify-center rounded-l bg-foreground text-xs font-semibold italic text-background sm:w-24 sm:text-base">
                        <span className="mr-1 hidden sm:flex">Option</span>
                        <span className="flex sm:hidden">O</span>1
                      </div>
                      <div className="flex grow items-center rounded-r border border-l-0 px-4 text-xs font-bold sm:text-base">
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
                      <div className="flex w-8 flex-none items-center justify-center rounded-l bg-foreground text-xs font-semibold italic text-background sm:w-24 sm:text-base">
                        <span className="mr-1 hidden sm:flex">Option</span>
                        <span className="flex sm:hidden">O</span>2
                      </div>
                      <div className="flex grow items-center rounded-r border border-l-0 px-4 text-xs font-bold sm:text-base">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
