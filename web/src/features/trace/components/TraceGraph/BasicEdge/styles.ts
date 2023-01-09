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
  edgeLabelContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    width: "fit-content",
    height: "fit-content",
    margin: "auto",
    fontSize: 12,
    "&:hover": {
      cursor: "default",
    },
  },
  timeContainer: {
    color: "#ffffff",
    background: "#0B0B0D",
  },
  counterContainer: {
    paddingLeft: "25%",
    paddingRight: "25%",
  },
  counterBoxContainer: {
    background: "#3b3c42",
    border: 1,
    borderColor: "#96979e",
    borderRadius: 0.5,
  },
};
