function ErrorAttr({ name, value }) {
  return (
    <tr className="ErrorMessage--detailItem">
      <td className="ErrorMessage--attr">{name}</td>
      <td className="ErrorMessage--value">{value}</td>
    </tr>
  );
}

function Message(props) {
  const { className, error, wrap, wrapperClassName } = props;
  const cssClass = `ErrorMessage--msg ${className || ""}`;
  let msg;
  if (typeof error === "string") {
    msg = <h3 className={cssClass}>{error}</h3>;
  } else {
    msg = <h3 className={cssClass}>{error.message}</h3>;
  }
  if (wrap) {
    return (
      <div className={`ErrorMessage ${wrapperClassName || ""}`}>{msg}</div>
    );
  }
  return msg;
}

Message.defaultProps = {
  className: undefined,
  wrap: false,
  wrapperClassName: undefined,
};

function Details(props) {
  const { className, error, wrap, wrapperClassName } = props;
  if (typeof error === "string") {
    return null;
  }
  const { httpStatus, httpStatusText, httpUrl, httpQuery, httpBody } = error;
  const bodyExcerpt =
    httpBody && httpBody.length > 1024
      ? `${httpBody.slice(0, 1021).trim()}...`
      : httpBody;
  const details = (
    <div
      className={`ErrorMessage--details ${className || ""} u-simple-scrollbars`}
    >
      <table className="ErrorMessage--detailsTable">
        <tbody>
          {httpStatus ? <ErrorAttr name="Status" value={httpStatus} /> : null}
          {httpStatusText ? (
            <ErrorAttr name="Status text" value={httpStatusText} />
          ) : null}
          {httpUrl ? <ErrorAttr name="URL" value={httpUrl} /> : null}
          {httpQuery ? <ErrorAttr name="Query" value={httpQuery} /> : null}
          {bodyExcerpt ? (
            <ErrorAttr name="Response body" value={bodyExcerpt} />
          ) : null}
        </tbody>
      </table>
    </div>
  );

  if (wrap) {
    return (
      <div className={`ErrorMessage ${wrapperClassName || ""}`}>{details}</div>
    );
  }
  return details;
}

Details.defaultProps = {
  className: undefined,
  wrap: false,
  wrapperClassName: undefined,
};

export default function ErrorMessage({
  className,
  detailClassName,
  error,
  messageClassName,
}) {
  if (!error) {
    return null;
  }
  if (typeof error === "string") {
    return (
      <Message
        className={messageClassName}
        error={error}
        wrapperClassName={className}
        wrap
      />
    );
  }
  return (
    <div className={`ErrorMessage ${className || ""}`}>
      <Message error={error} className={messageClassName} />
      <Details error={error} className={detailClassName} />
    </div>
  );
}

ErrorMessage.defaultProps = {
  className: undefined,
  detailClassName: undefined,
  messageClassName: undefined,
};

ErrorMessage.Message = Message;
ErrorMessage.Details = Details;
