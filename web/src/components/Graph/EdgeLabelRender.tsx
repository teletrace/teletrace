import { MutableRefObject, ReactElement, useRef } from "react";
import { createPortal } from "react-dom";
import { useStore } from "reactflow";

interface EdgeLabelProps {
  children: ReactElement;
}

export const EdgeLabelRender = ({ children }: EdgeLabelProps) => {
  const domNode: HTMLDivElement | null = useStore((s) => s.domNode);
  const renderer: MutableRefObject<Element | null> = useRef(null);

  if (!domNode) {
    return null;
  }

  if (!renderer.current) {
    const rendererDiv: HTMLDivElement = document.createElement("div");
    rendererDiv.classList.add("edgelabel-renderer");
    const reactFlowViewPort = domNode.querySelector(".react-flow__viewport");
    if (!reactFlowViewPort) {
      return null;
    }
    reactFlowViewPort.appendChild(rendererDiv);
    renderer.current = rendererDiv;
  }

  return createPortal(children, renderer.current);
};
