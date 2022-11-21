import sortBy from "lodash-es/sortBy";

import { getProcessServiceName } from "./process.js";

export const getSpanId = (span) => span.spanID;
export const getSpanName = (span) => span.operationName;
export const getSpanDuration = (span) => span.duration;
export const getSpanTimestamp = (span) => span.startTime;
export const getSpanProcessId = (span) => span.processID;
export const getSpanReferences = (span) => span.references || [];

export const getSpanProcess = (span) => {
  if (!span.process) {
    throw new Error(
      `you must hydrate the spans with the processes, perhaps
      using hydrateSpansWithProcesses(), before accessing a span's process`
    );
  }

  return span.process;
};

export const getSpanServiceName = (span) =>
  getProcessServiceName(getSpanProcess(span));

export const getSpanLogoType = (type, tags) => {
  const RESOURCE_TYPES = {
    API_GATEWAY: "api_gateway",
    ELASTICS_LOAD_BALANCER: "elastic_load_balancer",
    HTTP: "http",
    LAMBDA: "lambda",
    RDS: "rds",
    SQL: "sql",
    STEP_FUNCTIONS_LAMBDA: "step_function_lambda",
    TENCENT_API_GATEWAY: "tencent_api_gateway",
  };
  if (tags["aws.service"] === "api_gateway" && type === RESOURCE_TYPES.HTTP)
    return RESOURCE_TYPES.API_GATEWAY;
  if (
    tags["aws.service"] === "elastic_load_balancing" &&
    type === RESOURCE_TYPES.HTTP
  )
    return RESOURCE_TYPES.ELASTICS_LOAD_BALANCER;
  if (
    tags["aws.lambda.is_step_function"] === true &&
    type === RESOURCE_TYPES.LAMBDA
  )
    return RESOURCE_TYPES.STEP_FUNCTIONS_LAMBDA;
  if (tags["aws.service"] === "rds" && type === RESOURCE_TYPES.SQL)
    return RESOURCE_TYPES.RDS;
  if (
    // eslint-disable-next-line no-prototype-builtins
    tags.hasOwnProperty("tencent.api_gateway.stage") &&
    type === RESOURCE_TYPES.HTTP
  )
    return RESOURCE_TYPES.TENCENT_API_GATEWAY;

  return type;
};

export const sortSpans = (spans) => {
  return sortBy(spans, "span.startTimeUnixNano");
};

export const transformSpan = (span) => {
  return {
    spanID: span.span.spanId,
    startTime: span.span.startTimeUnixNano / 1000,
    duration: (span.span.endTimeUnixNano - span.span.startTimeUnixNano) / 1000,
    parentSpanId: span.span.parentSpanId,
    traceId: span.span.traceId,
    error: span.span.status,
  };
};

