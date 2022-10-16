package v1

type Attributes map[string]any

type SpanEvent struct {
	TimeUnixNano           uint64
	Name                   string
	Attributes             Attributes
	DroppedAttributesCount uint32
}

type SpanLink struct {
	TraceId                []byte
	SpanId                 []byte
	TraceState             string
	Attributes             Attributes
	DroppedAttributesCount uint32
}

type SpanStatus struct {
	Message string
	Code    uint32
}

type Resource struct {
	Attributes             Attributes
	DroppedAttributesCount int32
}

type InstrumentationScope struct {
	Name                   string
	Version                string
	Attributes             Attributes
	DroppedAttributesCount int32
}

type Span struct {
	TraceId                []byte
	SpanId                 []byte
	TraceState             string
	ParentSpanId           []byte
	Name                   string
	Kind                   int32
	StartTimeUnixNano      uint64
	EndTimeUnixNano        uint64
	Attributes             Attributes
	DroppedAttributesCount int32
	Events                 []*SpanEvent
	DroppedEventsCount     uint32
	Links                  []*SpanLink
	DroppedLinksCount      uint32
	Status                 *SpanStatus
}

type ExternalFields struct {
	DurationNano uint64
}

type InternalSpan struct {
	Resource       *Resource
	Scope          *InstrumentationScope
	Span           *Span
	ExternalFields *ExternalFields
	TimestampNano  uint64
}
