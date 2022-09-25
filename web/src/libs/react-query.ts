import { DefaultOptions, QueryClient } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {};
export const queryClient = new QueryClient({ defaultOptions: queryConfig });
