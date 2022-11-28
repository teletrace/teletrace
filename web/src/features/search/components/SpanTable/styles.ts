import { CSSProperties } from "react";

const styles: { [name: string]: CSSProperties } = {
  paper: { display: "flex", maxHeight: "100%" },
  progress: { margin: 0, position: "absolute", top: 47, right: 0, left: 0 },
  container: { minHeight: 0, position: "relative", borderRadius: "8px" },
  tableContainer: { borderRadius: "8px" },
};

export default styles;
