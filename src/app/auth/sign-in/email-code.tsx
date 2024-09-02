'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useSignIn } from '@clerk/nextjs';
import { OTPInput, type SlotProps } from 'input-otp';
import { Minus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/loading';

import { cn } from '@/lib/utils';

type Props = {
  setError: (s: string) => void;
};

export const EmailCode: React.FC<Props> = ({ setError }) => {
  const router = useRouter();
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);

  const verifyCode = async (otp: string) => {
    if (!signInLoaded || typeof otp !== 'string') {
      return null;
    }
    setIsLoading(true);
    await signIn
      .attemptFirstFactor({
        strategy: 'email_code',
        code: otp,
      })
      .then(async (result) => {
        if (result.status === 'complete' && result.createdSessionId) {
          toast.success('Signed in', {
            description: 'redirecting...',
          });
          await setActive({ session: result.createdSessionId });
          router.push('/apis');
        }
      })
      .catch((err) => {
        setError(
          err.errors.at(0)?.longMessage ??
            'Unknown error, pleae contact support@unkey.dev',
        );
      });
    setIsLoading(false);
  };

  const resendCode = async () => {
    try {
      const firstFactor = signIn?.supportedFirstFactors?.find(
        (f) => f.strategy === 'email_code',
      ) as { emailAddressId: string } | undefined;
      if (!firstFactor) {
        return null;
      }
      const p = signIn!.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: firstFactor.emailAddressId,
      });
      toast.promise(p, {
        loading: 'Sending new code ...',
        success: 'A new code has been sent to your email',
      });
      await p;
    } catch (error) {
      setIsLoading(false);
      setError((error as Error).message);
      console.error(error);
    }
  };

  const [otp, setOtp] = React.useState('');

  return (
    <div className="mx-auto flex max-w-sm flex-col text-left">
      <h1 className="bg-gradient-to-r from-white to-white/30 bg-clip-text text-4xl text-transparent">
        Security code sent!
      </h1>
      <p className="mt-4 text-sm text-white/40">
        To continue, please enter the 6 digit verification code sent to the
        provided email.
      </p>

      <p className="mt-2 text-sm text-white/40">
        Didn't receive the code?{' '}
        <Button type="button" onClick={resendCode}>
          Resend
        </Button>
      </p>
      <form
        className="mt-10 flex flex-col gap-12"
        onSubmit={() => verifyCode(otp)}
      >
        <OTPInput
          data-1p-ignore
          value={otp}
          onChange={setOtp}
          onComplete={() => verifyCode(otp)}
          maxLength={6}
          render={({ slots }) => (
            <div className="flex items-center justify-between">
              {slots.slice(0, 3).map((slot, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: I have nothing better
                <Slot key={idx} {...slot} />
              ))}
              <Minus className="h-6 w-6 text-white/15" />
              {slots.slice(3).map((slot, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: I have nothing better
                <Slot key={idx} {...slot} />
              ))}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          onClick={() => verifyCode(otp)}
        >
          {isLoading ? <Loading className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue
        </Button>
      </form>
    </div>
  );
};

const Slot: React.FC<SlotProps> = (props) => (
  <div
    className={cn(
      'relative h-12 w-10 rounded-lg border border-white/20 text-[2rem] text-base font-light text-white',
      'flex items-center justify-center',
      'transition-all duration-300',
      'group-focus-within:border-white/50 group-hover:border-white/50',
      'outline outline-0 outline-white',
      { 'outline-1': props.isActive },
    )}
  >
    {props.char !== null && <div>{props.char}</div>}
  </div>
);
