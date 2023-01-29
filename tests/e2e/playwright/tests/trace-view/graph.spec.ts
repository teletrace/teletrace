/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect } from "@playwright/test";
import {
  CreateAndSendMultipleTraces,
  SpanProps,
  TraceProps,
} from "../../utils/spans-generator/spans-generator";
import { ElasticConnector } from "../../utils/connectors/elastic-connector";

let traceId;
let spanId;

function CreateStaticData(): TraceProps[] {
  const span1: SpanProps = {
    spanId: "span-1",
    parentSpanID: null,
  };

  const span2: SpanProps = {
    spanId: "span-2",
    parentSpanID: "span-1",
  };

  const Service1: TraceProps = {
    serviceName: "test-service-1",
    traceName: "test-trace-1",
    spans: [span1],
  };

  const Service2: TraceProps = {
    serviceName: "test-service-2",
    traceName: "test-trace-2",
    spans: [span2],
  };
  const traces: TraceProps[] = [Service1, Service2];
  return traces;
}

test.beforeAll(async () => {
  const traces = CreateStaticData();
  const result = CreateAndSendMultipleTraces(traces);

  expect(result.length > 0).toBeTruthy();

  traceId = result[0].span.spanContext().traceId;
  spanId = result[0].span.spanContext().spanId;
});

test.afterAll(async () => {
  await new ElasticConnector().clean();
});

test.beforeEach(async ({ page }) => {
  await page.goto(`http://localhost:8080/trace/${traceId}?spanId=${spanId}`);

  // Waiting for seletor to ensure graph has been rendered to the screen
  await page.waitForSelector(".react-flow__renderer");
});

test.describe("TraceGraph Component Test Suite", () => {
  test("Test number of nodes", async ({ page }) => {
    const nodesNum = await page.locator(".react-flow__node").count();

    expect(nodesNum).toBe(2);
  });

  test("Test number of edges", async ({ page }) => {
    const edgeNum = await page.locator(".react-flow__edge").count();

    expect(edgeNum).toBe(1);
  });
});

test("Test selected node behavior", async ({ page }) => {
  await page.getByRole("button", { name: "fit view" }).click();

  const graphNodes = await page.locator(".react-flow__node[data-testid]").all();

  for (const node of graphNodes) {
    const testid_name = await node.getAttribute("data-testid");

    expect(testid_name).toBeTruthy();

    if (testid_name) {
      const clickableNode = page.getByTestId(testid_name);
      await clickableNode.click();
      expect(await node.getAttribute("class")).toContain("selected");
      const nodeChildElements = await node.locator(".MuiBox-root").all();
      const borderColor = await nodeChildElements[1].evaluate((childElement) =>
        window.getComputedStyle(childElement).getPropertyValue("border")
      );
      expect(borderColor).toBe("1px solid rgb(0, 158, 180)");
    }
  }
});
