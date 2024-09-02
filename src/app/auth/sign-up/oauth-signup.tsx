'use client';

import * as React from 'react';

import { useSignUp } from '@clerk/nextjs';
import type { OAuthStrategy } from '@clerk/types';
import { toast } from 'sonner';

import { GitHub, Google } from '@/components/ui/icons';
import { Loading } from '@/components/loading';

import { OAuthButton } from '../oauth-button';

export function OAuthSignUp() {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signUp, isLoaded: signupLoaded } = useSignUp();

  const oauthSignIn = async (provider: OAuthStrategy) => {
    if (!signupLoaded) {
      return null;
    }
    try {
      setIsLoading(provider);
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/auth/sso-callback',
        redirectUrlComplete: '/new',
      });
    } catch (cause) {
      console.error(cause);
      setIsLoading(null);
      toast.error('Something went wrong, please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <OAuthButton onClick={() => oauthSignIn('oauth_github')}>
        {isLoading === 'oauth_github' ? (
          <Loading className="h-6 w-6" />
        ) : (
          <GitHub className="h-6 w-6" />
        )}
        GitHub
      </OAuthButton>
      <OAuthButton onClick={() => oauthSignIn('oauth_google')}>
        {isLoading === 'oauth_google' ? (
          <Loading className="h-6 w-6" />
        ) : (
          <Google className="h-6 w-6" />
        )}
        Google
      </OAuthButton>
    </div>
  );
}
