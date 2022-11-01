import * as React from "react";

import { formatDuration } from "./utils";
import { TNil } from "../../../types";

import "./Ticks.css";

type TicksProps = {
  endTime?: number | TNil;
  numTicks: number;
  showLabels?: boolean | TNil;
  startTime?: number | TNil;
};

export default function Ticks(props: TicksProps) {
  const { endTime, numTicks, showLabels, startTime } = props;

  let labels: undefined | string[];
  if (showLabels) {
    labels = [];
    const viewingDuration = (endTime || 0) - (startTime || 0);
    for (let i = 0; i < numTicks; i++) {
      const durationAtTick =
        (startTime || 0) + (i / (numTicks - 1)) * viewingDuration;
      labels.push(formatDuration(durationAtTick));
    }
  }
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i < numTicks; i++) {
    const portion = i / (numTicks - 1);
    ticks.push(
      <div
        key={portion}
        className="Ticks--tick"
        style={{
          left: `${portion * 100}%`,
        }}
      >
        {labels && (
          <span
            className={`Ticks--tickLabel ${portion >= 1 ? "isEndAnchor" : ""}`}
          >
            {labels[i]}
          </span>
        )}
      </div>
    );
  }
  return <div className="Ticks">{ticks}</div>;
}

Ticks.defaultProps = {
  endTime: null,
  showLabels: null,
  startTime: null,
};
