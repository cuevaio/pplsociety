'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useSignUp } from '@clerk/nextjs';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeInStagger } from '@/components/fade-in';
import { Loading } from '@/components/loading';

type Props = {
  setError: (e: string | null) => void;
  setVerification: (b: boolean) => void;
};

export const EmailSignUp: React.FC<Props> = ({ setError, setVerification }) => {
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp();

  const [isLoading, setIsLoading] = React.useState(false);
  const [_transferLoading, setTransferLoading] = React.useState(true);
  const router = useRouter();
  React.useEffect(() => {
    const signUpFromParams = async () => {
      const ticket = new URL(window.location.href).searchParams.get(
        '__clerk_ticket',
      );
      const emailParam = new URL(window.location.href).searchParams.get(
        'email',
      );
      if (!ticket && !emailParam) {
        return;
      }
      if (ticket) {
        await signUp
          ?.create({
            strategy: 'ticket',
            ticket,
          })
          .then((result) => {
            if (result.status === 'complete' && result.createdSessionId) {
              setActive({ session: result.createdSessionId }).then(() => {
                router.push('/apis');
              });
            }
          })
          .catch((err) => {
            setTransferLoading(false);
            setError((err as Error).message);
            console.error(err);
          });
      }

      if (emailParam) {
        setVerification(true);
        await signUp
          ?.create({
            emailAddress: emailParam,
          })
          .then(async () => {
            await signUp.prepareEmailAddressVerification();
            // set verification to true so we can show the code input
            setVerification(true);
            setTransferLoading(false);
          })
          .catch((err) => {
            setTransferLoading(false);
            if (err.errors[0].code === 'form_identifier_exists') {
              toast.error(
                'It looks like you have an account. Please use sign in',
              );
            } else {
            }
          });
      }
    };
    signUpFromParams();
    setTransferLoading(false);
  }, [signUpLoaded]);

  const signUpWithCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    const first = new FormData(e.currentTarget).get('first');
    const last = new FormData(e.currentTarget).get('last');

    if (
      !signUpLoaded ||
      typeof email !== 'string' ||
      typeof first !== 'string' ||
      typeof last !== 'string'
    ) {
      return null;
    }

    try {
      setIsLoading(true);
      await signUp
        .create({
          emailAddress: email,
          firstName: first,
          lastName: last,
        })
        .then(async () => {
          await signUp.prepareEmailAddressVerification();
          setIsLoading(false);
          // set verification to true so we can show the code input
          setVerification(true);
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.errors[0].code === 'form_identifier_exists') {
            toast.error(
              'It looks like you have an account. Please use sign in',
            );
          } else {
            toast.error("We couldn't sign you up. Please try again later");
          }
        });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <FadeInStagger>
      <form className="grid gap-2" onSubmit={signUpWithCode}>
        <div className="grid gap-4">
          <div className="flex flex-row gap-3">
            <div className="flex w-1/2 flex-col items-start gap-2">
              <label htmlFor="first" className="text-xs text-white/50">
                First Name
              </label>
              <Input
                name="first"
                placeholder="Bruce"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                className="placeholder:white/20 h-10 border-white/20 bg-transparent text-white duration-500 hover:border-white/40 hover:bg-white/20 focus:border-white focus:bg-white focus:text-black"
              />
            </div>
            <div className="flex w-1/2 flex-col items-start gap-2">
              <label htmlFor="last" className="text-xs text-white/50">
                Last Name
              </label>
              <Input
                name="last"
                placeholder="Banner"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                className="placeholder:white/20 h-10 border-white/20 bg-transparent text-white duration-500 hover:border-white/40 hover:bg-white/20 focus:border-white focus:bg-white focus:text-black"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="email" className="text-xs text-white/50">
              Email
            </label>
            <Input
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              required
              className="placeholder:white/20 h-10 border-white/20 bg-transparent text-white duration-500 hover:border-white/40 hover:bg-white/20 focus:border-white focus:bg-white focus:text-black"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="mt-8 flex h-10 items-center justify-center gap-2 rounded-lg border border-white bg-white px-4 text-sm font-semibold text-black duration-200 hover:border-white/30 hover:bg-black hover:text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loading className="h-4 w-4 animate-spin" />
          ) : (
            'Sign Up with Email'
          )}
        </Button>
      </form>
    </FadeInStagger>
  );
};
