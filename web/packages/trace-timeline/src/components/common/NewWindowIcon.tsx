import cx from "classnames";
// ** CHANGED - replaced react-icons with ant-design/icons **
import { SelectOutlined } from "@ant-design/icons";
import "./NewWindowIcon.css";

type Props = {
  isLarge?: boolean;
};

export default function NewWindowIcon(props: Props) {
  const { isLarge, ...rest } = props;
  const cls = cx("NewWindowIcon", { "is-large": isLarge });
  return <SelectOutlined rotate={90} className={cls} {...rest} />;
}

NewWindowIcon.defaultProps = {
  isLarge: false,
};
