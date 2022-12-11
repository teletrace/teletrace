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

export const styles = {
  nodeBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 0,
    "&:hover": {
      cursor: "pointer",
    },
  },
  nodeIconBox: {
    height: "50px",
    width: "50px",
    borderRadius: "50%",
    border: "1px solid #5a5b61",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px",
  },
  nodeIcon: {
    height: "100%",
    width: "100%",
  },
  nodeName: {
    color: "#E9EAF1",
    fontWeight: 600,
    fontSize: "16px",
  },
  nodeService: {
    color: "#B6B7BE",
    fontWeight: 500,
    fontSize: "14px",
  },
};
