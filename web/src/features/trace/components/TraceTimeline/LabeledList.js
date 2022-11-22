import { Divider } from "@mui/material";
import { common, grey } from "@mui/material/colors";

import { theme } from "@/styles";

export default function LabeledList(props) {
  const { className, items } = props;
  return (
    <ul
      style={theme.typography.caption}
      className={`LabeledList ${className || ""}`}
    >
      {items.map(({ key, label, value }, i) => {
        const divider = i < items.length - 1 && (
          <li className="LabeledList--item" key={`${key}--divider`}>
            <Divider
              sx={{
                backgroundColor: common.white,
                height: "12px",
                margin: "0 14px",
                width: "0.1px",
              }}
              orientation="vertical"
              variant="middle"
              flexItem
            />
          </li>
        );
        return [
          <li className="LabeledList--item" key={key}>
            <span style={{ color: grey[300] }} className="LabeledList--label">
              {label}
            </span>
            <strong>{value}</strong>
          </li>,
          divider,
        ];
      })}
    </ul>
  );
}
