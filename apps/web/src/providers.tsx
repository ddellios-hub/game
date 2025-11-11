"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { IntlProvider } from "next-intl";
import { getDictionary } from "@sandbox/game-core";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const locale = "en";
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale={locale} messages={getDictionary(locale)}>
          {children}
        </IntlProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
