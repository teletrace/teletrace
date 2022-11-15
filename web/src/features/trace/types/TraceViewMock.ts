import { InternalSpan } from "@/types/span";

export type SearchResponse = {
  spans: InternalSpan[];
  metadata?: { nextToken: string };
};

export const trace_res: SearchResponse = {
  spans: [
    {
      resource: {
        attributes: {
          "host.name": "be7832d5d56d",
          ip: "172.25.0.5",
          "opencensus.exporterversion": "Jaeger-Java-0.28.0",
          "service.name": "frontend",
        },
        droppedAttributesCount: 0,
      },
      scope: {
        name: "",
        version: "",
        attributes: {},
        droppedAttributesCount: 0,
      },
      span: {
        traceId: "0000000000000000e5a1352088164ca1",
        spanId: "e5a1352088164ca1",
        traceState: "",
        parentSpanId: "",
        name: "/product",
        kind: 0,
        startTimeUnixNano: 1668436113725000000,
        endTimeUnixNano: 1668436114175000000,
        attributes: {
          "http.method": "GET",
          "http.status_code": 200,
          "http.url": "http://frontend/product",
          region: "us-west-1",
          "sampler.param": true,
          "sampler.type": "const",
          starter: "bulbasaur",
          version: "v125",
        },
        droppedAttributesCount: 0,
        events: undefined,
        droppedEventsCount: 0,
        links: undefined,
        droppedLinksCount: 0,
        status: {
          message: "",
          code: 0,
        },
      },
      externalFields: {
        duration: 450000000,
      },
    },
    {
      resource: {
        attributes: {
          "host.name": "be7832d5d56d",
          ip: "172.25.0.5",
          "opencensus.exporterversion": "Jaeger-Java-0.28.0",
          "service.name": "adservice",
        },
        droppedAttributesCount: 0,
      },
      scope: {
        name: "",
        version: "",
        attributes: {},
        droppedAttributesCount: 0,
      },
      span: {
        traceId: "0000000000000000e5a1352088164ca1",
        spanId: "83874c99ea08d0b9",
        traceState: "",
        parentSpanId: "e5a1352088164ca1",
        name: "/AdRequest",
        kind: 0,
        startTimeUnixNano: 1668436113755000000,
        endTimeUnixNano: 1668436114077000000,
        attributes: {
          "http.method": "GET",
          "http.status_code": 200,
          "http.url": "http://adservice/AdRequest",
        },
        droppedAttributesCount: 0,
        events: undefined,
        droppedEventsCount: 0,
        links: undefined,
        droppedLinksCount: 0,
        status: {
          message: "",
          code: 0,
        },
      },
      externalFields: {
        duration: 322000000,
      },
    },
    {
      resource: {
        attributes: {
          "host.name": "be7832d5d56d",
          ip: "172.25.0.5",
          "opencensus.exporterversion": "Jaeger-Java-0.28.0",
          "service.name": "productcatalogservice",
        },
        droppedAttributesCount: 0,
      },
      scope: {
        name: "",
        version: "",
        attributes: {},
        droppedAttributesCount: 0,
      },
      span: {
        traceId: "0000000000000000e5a1352088164ca1",
        spanId: "c5bdbaf44b093239",
        traceState: "",
        parentSpanId: "e5a1352088164ca1",
        name: "/GetProducts",
        kind: 0,
        startTimeUnixNano: 1668436113776000000,
        endTimeUnixNano: 1668436113859000000,
        attributes: {
          "http.method": "GET",
          "http.status_code": 200,
          "http.url": "http://productcatalogservice/GetProducts",
          region: "us-west-1",
          starter: "bulbasaur",
          version: "v52",
        },
        droppedAttributesCount: 0,
        events: undefined,
        droppedEventsCount: 0,
        links: undefined,
        droppedLinksCount: 0,
        status: {
          message: "",
          code: 0,
        },
      },
      externalFields: {
        duration: 83000000,
      },
    },
    {
      resource: {
        attributes: {
          "host.name": "be7832d5d56d",
          ip: "172.25.0.5",
          "opencensus.exporterversion": "Jaeger-Java-0.28.0",
          "service.name": "productcatalogservice",
        },
        droppedAttributesCount: 0,
      },
      scope: {
        name: "",
        version: "",
        attributes: {},
        droppedAttributesCount: 0,
      },
      span: {
        traceId: "0000000000000000e5a1352088164ca1",
        spanId: "be7319b3489fdcf4",
        traceState: "",
        parentSpanId: "2794be2524a4939b",
        name: "products.getProducts",
        kind: 0,
        startTimeUnixNano: 1668436113836000000,
        endTimeUnixNano: 1668436113932000000,
        attributes: {
          "db.system": "mongodb",
          "db.name": "shopDb",
        },
        droppedAttributesCount: 0,
        events: undefined,
        droppedEventsCount: 0,
        links: undefined,
        droppedLinksCount: 0,
        status: {
          message: "",
          code: 0,
        },
      },
      externalFields: {
        duration: 96000000,
      },
    },
    {
      resource: {
        attributes: {
          "faas.name": "my-lambda-function",
        },
        droppedAttributesCount: 0,
      },
      scope: {
        name: "",
        version: "",
        attributes: {},
        droppedAttributesCount: 0,
      },
      span: {
        traceId: "0000000000000000e5a1352088164ca1",
        spanId: "2794be2524a4939b",
        traceState: "",
        parentSpanId: "e5a1352088164ca1",
        name: "",
        kind: 0,
        startTimeUnixNano: 1668436113768000000,
        endTimeUnixNano: 1668436114028000000,
        attributes: {
          "faas.trigger": "datasource",
          "faas.execution": "af9d5aa4-a685-4c5f-a22b-444f80b3cc28",
        },
        droppedAttributesCount: 0,
        events: undefined,
        droppedEventsCount: 0,
        links: undefined,
        droppedLinksCount: 0,
        status: {
          message: "",
          code: 0,
        },
      },
      externalFields: {
        duration: 260000000,
      },
    },
  ],
};
