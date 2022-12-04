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
