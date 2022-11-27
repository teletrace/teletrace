import { formatDuration } from "../../utils/date.js";

export default function TickLabels(props) {
  const { numTicks, duration } = props;

  const ticks = [];
  for (let i = 0; i < numTicks; i += 1) {
    const portion = i / numTicks;
    const style =
      // eslint-disable-next-line no-nested-ternary
      portion === 1
        ? { right: "0" }
        : portion === 0
        ? { left: "1%" }
        : { left: `${portion * 100}%` };
    ticks.push(
      <div
        key={portion}
        className="TickLabels--label"
        style={style}
        data-test="tick"
      >
        {formatDuration(duration * portion)}
      </div>
    );
  }

  return <div className="TickLabels">{ticks}</div>;
}
