package esinternal

import internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"

type ESSpan struct {
	internalspanv1.Span
	StartTimeUnixNano string
	EndTimeUnixNano   string
}

type ESInternalSpan struct {
	Resource              *internalspanv1.Resource             `json:"resource"`
	Scope                 *internalspanv1.InstrumentationScope `json:"scope"`
	Span                  *ESSpan                              `json:"span"`
	ExternalFields        *internalspanv1.ExternalFields       `json:"externalFields"`
	IngestionTimeUnixNano uint64                               `json:"ingestionTimeUnixNano"`
}
