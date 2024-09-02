'use client';

import * as React from 'react';
import Link from 'next/link';

import { FadeIn } from '@/components/fade-in';

import { ErrorBanner } from '../../banners';
import { EmailCode } from '../email-code';
import { EmailSignUp } from '../email-signup';
import { OAuthSignUp } from '../oauth-signup';

export default function AuthenticationPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [verify, setVerify] = React.useState(false);
  return (
    <div className="flex flex-col justify-center space-y-6">
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}

      {!verify ? (
        <>
          <div className="flex flex-col">
            <h1 className="text-4xl text-white">Create new account</h1>
            <p className="text-md mt-4 text-sm text-white/50">
              Sign up to Unkey or?
              <Link
                href="/auth/sign-in"
                className="ml-2 text-white hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
          <div className="mt-4 grid gap-10">
            <OAuthSignUp />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black px-2 text-white/50">
                  or continue using email
                </span>
              </div>
            </div>
            <EmailSignUp setError={setError} setVerification={setVerify} />
          </div>
        </>
      ) : (
        <FadeIn>
          <EmailCode setError={(e: string) => setError(e)} />
        </FadeIn>
      )}
    </div>
  );
}
