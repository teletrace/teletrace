/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
