import { Divider, Stack } from "@mui/material";
import { useState } from "react";

import { TagValuesSelector } from "../TagValuesSelector";

export const TagSidebar = () => {
  type TagValues = Array<number | string>;

  const [statusCodes, setStatusCodes] = useState<TagValues>([]);
  const [serviceNames, setServiceNames] = useState<TagValues>([]);
  const [httpRoutes, setHttpRoutes] = useState<TagValues>([]);
  const [httpMethods, setHttpMethods] = useState<TagValues>([]);
  const [httpStatusCodes, setHttpStatusCodes] = useState<TagValues>([]);
  const [instumentationLibs, setInstrumentationLibs] = useState<TagValues>([]);

  return (
    <Stack spacing="2px">
      <TagValuesSelector
        title="Status"
        tag="span.status"
        value={statusCodes}
        onChange={setStatusCodes}
      />

      <TagValuesSelector
        searchable
        title="Service Name"
        tag="service.name"
        value={serviceNames}
        onChange={setServiceNames}
      />
      <TagValuesSelector
        searchable
        title="HTTP Route"
        tag="http.route"
        value={httpRoutes}
        onChange={setHttpRoutes}
      />
      <TagValuesSelector
        searchable
        title="HTTP Method"
        tag="http.method"
        value={httpMethods}
        onChange={setHttpMethods}
      />
      <TagValuesSelector
        searchable
        title="HTTP Status Code"
        tag="http.status_code"
        value={httpStatusCodes}
        onChange={setHttpStatusCodes}
      />
      <TagValuesSelector
        searchable
        title="Instumentation Library"
        tag="instrumentation.library"
        value={instumentationLibs}
        onChange={setInstrumentationLibs}
      />
    </Stack>
  );
};
