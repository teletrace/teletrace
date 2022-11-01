import tNil from "./TNil";

export type TNil = tNil;

// export type ReduxState = {
//   archive: TracesArchive;
//   config: Config;
//   ddg: TDdgState;
//   dependencies: {
//     dependencies: { parent: string; child: string; callCount: number }[];
//     loading: boolean;
//     error: ApiError | TNil;
//   };
//   embedded: EmbeddedState;
//   router: Router & {
//     location: Location;
//   };
//   services: {
//     services: (string[]) | TNil;
//     serverOpsForService: Record<string, string[]>;
//     operationsForService: Record<string, string[]>;
//     loading: boolean;
//     error: ApiError | TNil;
//   };
//   trace: {
//     traces: Record<string, FetchedTrace>;
//     search: {
//       error?: ApiError;
//       results: string[];
//       state?: FetchedState;
//       query?: SearchQuery;
//     };
//   };
//   traceDiff: TTraceDiffState;
//   traceTimeline: TTraceTimeline;
//   metrics: MetricsReduxState;
// };
