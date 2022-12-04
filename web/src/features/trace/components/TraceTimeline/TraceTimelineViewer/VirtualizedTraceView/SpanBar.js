import { Tooltip } from "@mui/material";
import { compose, onlyUpdateForKeys, withProps, withState } from "recompose";

function toPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function SpanBar(props) {
  const {
    viewEnd,
    viewStart,
    color,
    label,
    hintSide,
    onClick,
    setLongLabel,
    shortLabel,
    rpc,
  } = props;

  return (
    <Tooltip
      componentsProps={{
        tooltip: {
          sx: {
            maxWidth: "none",
          },
        },
      }}
      title={label}
      arrow
      followCursor
      placement="top"
      onMouseOver={setLongLabel}
      onFocus={setLongLabel}
    >
      <div
        className="SpanBar--wrapper ub-flex ub-items-center"
        onClick={onClick}
        aria-hidden
      >
        <div
          aria-label={shortLabel}
          className="SpanBar--bar"
          style={{
            background: color,
            left: toPercent(viewStart),
            width: toPercent(viewEnd - viewStart),
          }}
        >
          <div className={`SpanBar--label is-${hintSide}`}>{shortLabel}</div>
        </div>
        {rpc && (
          <div
            className="SpanBar--rpc"
            style={{
              background: rpc.color,
              left: toPercent(rpc.viewStart),
              width: toPercent(rpc.viewEnd - rpc.viewStart),
            }}
          />
        )}
      </div>
    </Tooltip>
  );
}

export default compose(
  withState("label", "setLabel", (props) => props.shortLabel),
  withProps(({ setLabel, longLabel }) => ({
    setLongLabel: () => setLabel(longLabel),
    setShortLabel: () => setLabel(null),
  })),
  onlyUpdateForKeys(["label", "rpc", "viewStart", "viewEnd"])
)(SpanBar);
