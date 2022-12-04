import { formatDuration } from "../utils/date.js";

export default function Ticks(props) {
  const { endTime, numTicks, showLabels, startTime } = props;

  let labels;
  if (showLabels) {
    labels = [];
    const viewingDuration = (endTime || 0) - (startTime || 0);
    for (let i = 0; i < numTicks; i += 1) {
      const durationAtTick = startTime + (i / (numTicks - 1)) * viewingDuration;
      labels.push(formatDuration(durationAtTick));
    }
  }
  const ticks = [];
  for (let i = 0; i < numTicks; i += 1) {
    const portion = i / (numTicks - 1);
    ticks.push(
      <div
        key={portion}
        className="Ticks--tick ub-flex ub-items-center"
        style={{
          left: `${portion * 100}%`,
        }}
      >
        {labels && (
          <span
            className={`Ticks--tickLabel ub-pl3 ${
              portion >= 1 ? "isEndAnchor" : ""
            }`}
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
