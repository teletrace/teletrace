export class SpanStatus {
    constructor(public message: string, public code: number) {}
}

export class Span {
    constructor(
        public traceId: string, 
        public spanId: string, 
        public startTimeUnixNano: number,
        public endTimeUnixNano: number,
        public name: string,
        public status: SpanStatus
    ) {}
}
   
export class Resource {
    constructor(public attributes: Record<string, any>) {}
}

export class InternalSpan {
    constructor(public span: Span, public resource: Resource) {}
}
   