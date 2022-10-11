import "./styles/nodeIconStyle.css";
import IconInterface from "./interface/IconInterface";

const NodeIcon: React.FC<IconInterface> = (icon: IconInterface) => {
  return (
    <div className="node-icon">
      <img
        src={icon.path}
        alt={icon.name}
        width={"27.48px"}
        height={"27.48px"}
      ></img>
    </div>
  );
};

export default NodeIcon;
