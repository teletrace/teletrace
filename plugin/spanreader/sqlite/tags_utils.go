package sqlitespanreader

var staticTagTypeMap = map[string]string{
	"span.events.name":                    "Str",
	"span.events.droppedAttributesCount":  "Int",
	"span.events.spanId":                  "Str",
	"span.links.spanId":                   "Str",
	"span.links.traceState":               "Str",
	"span.links.droppedAttributesCount":   "Int",
	"scope.name":                          "Str",
	"scope.version":                       "Str",
	"scope.droppedAttributesCount":        "Int",
	"span.spanId":                         "Str",
	"span.traceId":                        "Str",
	"span.traceState":                     "Str",
	"span.parentSpanId":                   "Str",
	"span.name":                           "Str",
	"span.kind":                           "Int",
	"span.startTimeUnixNano":              "Int",
	"span.endTimeUnixNano":                "Int",
	"span.droppedAttributesCount":         "Int",
	"span.status.message":                 "Str",
	"span.status.code":                    "Int",
	"span.droppedResourceAttributesCount": "Int",
	"span.droppedEventsCount":             "Int",
	"span.droppedLinksCount":              "Int",
	"externalFields.durationNano":         "Int",
}

func isDynamicTagsTable(tableName string) bool {
	return tableName == "event_attributes" || tableName == "link_attributes" || tableName == "scope_attributes" || tableName == "span_attributes"
}
