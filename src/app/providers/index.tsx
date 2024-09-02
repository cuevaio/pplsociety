import { ReactNode } from 'react';

import { ClerkProvider } from '@clerk/nextjs';

import { ClientProviders } from './client';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#5C36A3',
          colorText: '#5C36A3',
        },
      }}
    >
      <ClientProviders>{children}</ClientProviders>
    </ClerkProvider>
  );
};
