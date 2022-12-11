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

const textContainer = {
  maxHeight: "80px",
  overflow: "hidden",
  padding: "7px 150px 4px 45px",
};

export const styles = {
  mainContainer: {
    background: "#0B0B0D",
    borderLeft: "1px solid #EF5854",
  },
  textContainer,
  textContainerExpanded: {
    ...textContainer,
    overflow: "visible",
    maxHeight: "fit-content",
  },
  typography: {
    color: "#EF5854",
    lineHeight: "22px",
  },
  readMoreButton: {
    borderTop: "1px solid #6E6F75",
    width: "107px",
    fontWeight: "500",
    fontSize: "10px",
    marginLeft: "220px",
    lineHeight: "12px",
    letterSpacing: "1.5px",
    borderRadius: "0px",
    color: "#FFFFFF",
    "&:hover": {
      background: "none",
    },
  },
};
