/**
 * Copyright 2022 Cisco Systems, Inc.
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

import {
  DefaultOptions,
  QueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { PromiseValue } from "type-fest";

const queryConfig: DefaultOptions = {
  queries: { refetchOnWindowFocus: false },
};
export const queryClient = new QueryClient({ defaultOptions: queryConfig });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractFnReturnType<FnType extends (...args: any) => any> =
  PromiseValue<ReturnType<FnType>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;
