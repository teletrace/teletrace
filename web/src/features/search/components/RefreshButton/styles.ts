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
import { keyframes } from "@emotion/react";

const liveSpansIconTransparentColor = "rgba(0, 205, 231, 0.3)";
const breathingAnimation = keyframes`
  0% {
      box-shadow:
      0 0 0 1px ${liveSpansIconTransparentColor},
      0 0 0 2px ${liveSpansIconTransparentColor},
      0 0 0 3px ${liveSpansIconTransparentColor}
  }

 50% {
      box-shadow:
      0 0 0 2px ${liveSpansIconTransparentColor},
      0 0 0 4px ${liveSpansIconTransparentColor},
      0 0 0 6px ${liveSpansIconTransparentColor}
 }

 100% {
      box-shadow:
      0 0 0 1px ${liveSpansIconTransparentColor},
      0 0 0 2px ${liveSpansIconTransparentColor},
      0 0 0 3px ${liveSpansIconTransparentColor}
  }
`;

const styles = {
  container: { alignItems: "center", height: "40px" },
  iconWrapper: { width: "30px", justifyContent: "center" },
  liveSpansIcon: {
    color: "transparent",
    background: "rgba(0, 205, 231, 1)",
    borderRadius: "50%",
    maxHeight: "8px",
    maxWidth: "8px",
    minHeight: "8px",
    minWidth: "8px",
    top: "50%",
    marginBottom: "2px",
    animation: `${breathingAnimation} 7s linear infinite`,
  },
  refreshingIcon: {
    maxHeight: "17px",
    maxWidth: "17px",
    minHeight: "17px",
    minWidth: "17px",
  },
  refreshStatusText: {
    marginLeft: "5px",
    fontSize: "14px",
    color: "#B6B7BE",
    fontFamily: "inter",
  },
};

export default styles;
