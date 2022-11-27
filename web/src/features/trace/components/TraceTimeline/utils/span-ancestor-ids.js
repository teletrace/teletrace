import _find from "lodash-es/find";
import _get from "lodash-es/get";

function getFirstAncestor(span) {
  return _get(
    _find(span.references, ({ span: ref }) => ref && ref.spanID),
    "span"
  );
}

export default function spanAncestorIds(span) {
  if (!span) return [];
  const ancestorIDs = new Set();
  let ref = getFirstAncestor(span);
  while (ref) {
    ancestorIDs.add(ref.spanID);
    ref = getFirstAncestor(ref);
  }
  return Array.from(ancestorIDs);
}
