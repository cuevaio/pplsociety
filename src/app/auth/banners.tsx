import type React from 'react';
import type { PropsWithChildren } from 'react';

import { AlertTriangle } from 'lucide-react';

export const ErrorBanner: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex items-center gap-4 rounded-lg border border-[#FB1048]/15 bg-[#FB1048]/15 p-4 text-[#FB1048]">
    <AlertTriangle className="h-4 w-4" />

    <p className="text-sm">{children}</p>
  </div>
);

export const WarnBanner: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex items-center gap-4 rounded-lg border border-[#FFD55D]/15 bg-[#FFD55D]/15 p-4 text-sm text-[#FFD55D]">
    <AlertTriangle className="h-4 w-4" />

    {children}
  </div>
);
