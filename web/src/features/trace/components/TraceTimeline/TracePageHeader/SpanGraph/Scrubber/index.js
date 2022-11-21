import cx from "classnames";

import { theme } from "@/styles";

import "./styles.css";

export default function Scrubber({
  active,
  isDragging,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  position,
}) {
  const xPercent = `${position * 100}%`;
  const className = cx("Scrubber", {
    active: active || isDragging,
    isDragging,
  });
  return (
    <g className={className}>
      <g
        className="Scrubber--handles"
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* handleExpansion is only visible when `isDragging` is true */}
        <rect
          x={xPercent}
          className="Scrubber--handleExpansion"
          style={{ transform: `translate(-4.5px)` }}
          width="4"
          height={active || isDragging ? "100%" : "20px"}
        />
        <rect
          x={xPercent}
          className="Scrubber--handle"
          fill={active || isDragging ? "#fff" : theme.grey[900]}
          style={{ transform: `translate(-1.5px)` }}
          width="2"
          height={active || isDragging ? "100%" : "20px"}
        />
      </g>
      <line
        fill={active || isDragging ? "#fff" : theme.grey[900]}
        className="Scrubber--line"
        y2="100%"
        x1={xPercent}
        x2={xPercent}
      />
    </g>
  );
}
