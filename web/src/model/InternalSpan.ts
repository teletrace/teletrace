export type SpanStatus = {
    message: string; 
    code: number;
}

export type Span = {
    traceId: string;
    spanId: string;
    startTimeUnixNano: number;
    endTimeUnixNano: number;
    name: string;
    status: SpanStatus;
}
   
export type Resource = {
    attributes: Record<string, any>;
}

export type InternalSpan = {
    span: Span;
    resource: Resource;
}
   