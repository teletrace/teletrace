/**
 * Copyright 2022 Epsagon
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
    flexFlow: "column nowrap",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    "&:hover": {
      cursor: "pointer",
    },
  },
  nodeIconBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 1.5,
    width: "fit-content",
    height: "fit-content",
    background: "transparent",
    border: 1,
    borderColor: "#5a5b61",
    borderRadius: 8,
    marginBottom: "auto",
  },
  nodeText: {
    fontWeight: 600,
    fontSize: 16,
    textAlign: "center",
  },
};
