import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import { Loader } from "@/components/Elements/Loader";
import { queryClient } from "@/libs/react-query";
import { theme } from "@/styles";

export type AppProvidersProps = {
  children: React.ReactNode;
  isStorybook?: boolean;
};

const ErrorFallback = () => (
  <div>Oops, something went wrong! try refreshing</div>
);

export const AppProviders = ({
  children,
  isStorybook = false,
}: AppProvidersProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Suspense fallback={<Loader />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {process.env.NODE_ENV !== "test" && !isStorybook && (
              <ReactQueryDevtools position="bottom-right" />
            )}
            <BrowserRouter>{children}</BrowserRouter>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </Suspense>
  </ThemeProvider>
);
