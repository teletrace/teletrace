const convertedTimestampKeys = ["externalFields.durationNano", "span.startTimeUnixNanoSec", "span.endTimeUnixNanoSec"]
export const isConvertedTimestamp = (tag: string) => convertedTimestampKeys.find(k => k === tag);
