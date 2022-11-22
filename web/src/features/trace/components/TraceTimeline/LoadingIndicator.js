export default function LoadingIndicator(props) {
  const { centered, className, small, ...rest } = props;
  const cls = `
    LoadingIndicator
    ${centered ? "is-centered" : ""}
    ${small ? "is-small" : ""}
    ${className || ""}
  `;
  return (
    <div className={cls} {...rest}>
      loading...
    </div>
  );
}

LoadingIndicator.defaultProps = {
  centered: false,
  className: undefined,
  small: false,
};
