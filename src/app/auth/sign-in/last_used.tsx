'use client';

import { useLocalStorage } from 'usehooks-ts';

export function useLastUsed() {
  return useLocalStorage<'github' | 'google' | 'email' | undefined>(
    'last_unkey_login',
    undefined,
  );
}

export const LastUsed: React.FC = () => {
  return (
    <span className="text-content-subtle absolute right-4 text-xs">
      Last used
    </span>
  );
};
