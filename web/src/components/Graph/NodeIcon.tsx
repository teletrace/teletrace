import React, { memo } from "react";

interface IconInterface {
  name: string;
  image: string;
}

const NodeIcon = ({ name, image }: Readonly<IconInterface>) => {
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
