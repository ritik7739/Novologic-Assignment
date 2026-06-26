'use client';

import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren, useMemo } from 'react';
import { createApolloClient } from './client';

export function Providers({ children }: PropsWithChildren) {
  const client = useMemo(() => createApolloClient(), []);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ApolloProvider>
  );
}
