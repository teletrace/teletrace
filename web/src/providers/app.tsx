import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";

import { Loader } from "@/components/Loader";

export type AppProvidersProps = {
  children: React.ReactNode;
};

const ErrorFallback = () => (
  <div>Oops, something went wrong! try refreshing</div>
);

export const AppProviders = ({ children }: AppProvidersProps) => (
  <Suspense fallback={<Loader />}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>{children}</BrowserRouter>
    </ErrorBoundary>
  </Suspense>
);
