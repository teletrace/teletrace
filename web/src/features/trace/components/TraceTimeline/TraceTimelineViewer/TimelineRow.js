function TimelineRow(props) {
  const { children, className = "", ...rest } = props;
  return (
    <div className={`flex-row ${className}`} {...rest}>
      {children}
    </div>
  );
}

function TimelineRowCell(props) {
  const { children, className = "", width, style, ...rest } = props;
  const widthPercent = `${width * 100}%`;
  const mergedStyle = {
    ...style,
    flexBasis: widthPercent,
    maxWidth: widthPercent,
  };
  return (
    <div className={`ub-relative ${className}`} style={mergedStyle} {...rest}>
      {children}
    </div>
  );
}

TimelineRow.Cell = TimelineRowCell;

export default TimelineRow;
