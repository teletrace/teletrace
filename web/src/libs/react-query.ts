import {
  DefaultOptions,
  QueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { PromiseValue } from "type-fest";

const queryConfig: DefaultOptions = {};
export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> = // eslint-disable-line @typescript-eslint/no-explicit-any
  PromiseValue<ReturnType<FnType>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;
