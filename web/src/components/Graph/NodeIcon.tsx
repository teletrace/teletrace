import { memo } from "react";

interface Icon {
  name: string;
  image: string;
}

const NodeIcon = ({ name, image }: Readonly<Icon>) => {
  return (
    <img
      style={{
        inset: "4.17%",
      }}
      alt={name}
      src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`}
    />
  );
};

export default memo(NodeIcon);
