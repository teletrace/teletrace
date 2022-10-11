import { useCallback, useContext } from "react";
import { Handle, Position } from "reactflow";

import IconInterface from "./interface/IconInterface";
import NodeIcon from "./NodeIcon";

import "./styles/basicNodeStyle.css";

const handleStyle = { left: 10 };

const my_icon: IconInterface = {
  name: "nodejs",
  path: "./images/icons/icon-test.svg",
};

const BasicNode = () => {
  const onChange = useCallback(
    (event: React.ChangeEventHandler<HTMLInputElement>) => {
      console.log(event);
    },
    []
  );
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="node-box">
        <div className="node-icon-box">
          <NodeIcon name={my_icon.name} path={my_icon.path} />
        </div>
        <div className="node-text">
          <div className="text-container">/Checkout</div>
          <div className="text-container">Http</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
};

export default BasicNode;
