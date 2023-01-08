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

test.beforeEach(async ({ page }) => {
  // page.setViewportSize({width: 1512, height: 739})
  await page.goto(
    "http://localhost:8080/trace/b9e89f4a6cf509036090086bdb5763e2?spanId=6ca52f2162cf019b"
  );

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
