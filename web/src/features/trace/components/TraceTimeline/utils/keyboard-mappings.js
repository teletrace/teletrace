/*
Copyright (c) 2017 Uber Technologies, Inc.
Modifications copyright (C) 2022 Cisco Systems, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export default {
  panLeft: { binding: ["a", "left"], label: "Pan left" },
  panLeftFast: {
    binding: ["shift+a", "shift+left"],
    label: "Pan left — Large",
  },
  panRight: { binding: ["d", "right"], label: "Pan right" },
  panRightFast: {
    binding: ["shift+d", "shift+right"],
    label: "Pan right — Large",
  },
  scrollPageDown: { binding: "s", label: "Scroll down" },
  scrollPageUp: { binding: "w", label: "Scroll up" },
  scrollToNextVisibleSpan: {
    binding: "f",
    label: "Scroll to the next visible span",
  },
  scrollToPrevVisibleSpan: {
    binding: "b",
    label: "Scroll to the previous visible span",
  },
  zoomIn: { binding: "up", label: "Zoom in" },
  zoomInFast: { binding: "shift+up", label: "Zoom in — Large" },
  zoomOut: { binding: "down", label: "Zoom out" },
  zoomOutFast: { binding: "shift+down", label: "Zoom out — Large" },
};
