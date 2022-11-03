package v1

type Attributes map[string]any

type SpanEvent struct {
	TimeUnixNano           uint64     `json:"timeUnixNano"`
	Name                   string     `json:"name"`
	Attributes             Attributes `json:"attributes"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type SpanLink struct {
	TraceId                [16]byte   `json:"traceId"`
	SpanId                 [8]byte    `json:"spanId"`
	TraceState             string     `json:"traceState"`
	Attributes             Attributes `json:"attributes"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type SpanStatus struct {
	Message string `json:"message"`
	Code    uint32 `json:"code"`
}

type Resource struct {
	Attributes             Attributes `json:"resources"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type InstrumentationScope struct {
	Name                   string     `json:"name"`
	Version                string     `json:"version"`
	Attributes             Attributes `json:"attributes"`
	DroppedAttributesCount uint32     `json:"droppedAttributesCount"`
}

type Span struct {
	TraceId                [16]byte     `json:"traceId"`
	SpanId                 [8]byte      `json:"spanId"`
	TraceState             string       `json:"traceState"`
	ParentSpanId           [8]byte      `json:"parentSpanId"`
	Name                   string       `json:"name"`
	Kind                   int32        `json:"kind"`
	StartTimeUnixNano      uint64       `json:"startTimeUnixNano"`
	EndTimeUnixNano        uint64       `json:"endTimeUnixNano"`
	Attributes             Attributes   `json:"attributes"`
	DroppedAttributesCount uint32       `json:"droppedAttributesCount"`
	Events                 []*SpanEvent `json:"events"`
	DroppedEventsCount     uint32       `json:"droppedEventsCount"`
	Links                  []*SpanLink  `json:"links"`
	DroppedLinksCount      uint32       `json:"droppedLinksCound"`
	Status                 *SpanStatus  `json:"status"`
}

type ExternalFields struct {
	DurationNano uint64 `json:"durationNano"`
}

type InternalSpan struct {
	Resource              *Resource             `json:"resource"`
	Scope                 *InstrumentationScope `json:"scope"`
	Span                  *Span                 `json:"span"`
	ExternalFields        *ExternalFields       `json:"externalFields"`
	IngestionTimeUnixNano uint64
}
