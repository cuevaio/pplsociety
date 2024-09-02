'use client';

import * as React from 'react';

import { useSignIn } from '@clerk/nextjs';
import type { OAuthStrategy } from '@clerk/types';
import { toast } from 'sonner';

import { GitHub, Google } from '@/components/ui/icons';
import { Loading } from '@/components/loading';

import { OAuthButton } from '../oauth-button';
import { LastUsed, useLastUsed } from './last_used';

export const OAuthSignIn: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<OAuthStrategy | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const [lastUsed, setLastUsed] = useLastUsed();

  const oauthSignIn = async (provider: OAuthStrategy) => {
    if (!signInLoaded) {
      return null;
    }
    try {
      setIsLoading(provider);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/auth/sso-callback',
        redirectUrlComplete: '/apis',
      });
      setLastUsed(provider === 'oauth_google' ? 'google' : 'github');
    } catch (err) {
      console.error(err);
      setIsLoading(null);
      toast.error((err as Error).message);
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
        GitHub {lastUsed === 'github' ? <LastUsed /> : null}
      </OAuthButton>
      <OAuthButton onClick={() => oauthSignIn('oauth_google')}>
        {isLoading === 'oauth_google' ? (
          <Loading className="h-6 w-6" />
        ) : (
          <Google className="h-6 w-6" />
        )}
        Google {lastUsed === 'google' ? <LastUsed /> : null}
      </OAuthButton>
    </div>
  );
};
