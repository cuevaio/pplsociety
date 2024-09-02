'use client';

import type { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';

type Props = {
  onClick: () => Promise<unknown>;
};
export const OAuthButton: React.FC<PropsWithChildren<Props>> = ({
  onClick,
  children,
}) => {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      {children}
    </Button>
  );
};
