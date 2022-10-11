import IconInterface from "./IconInterface";

interface CustomNodeInterface {
  id: string;
  type: string;
  icon: IconInterface;
  data: {
    label: string;
  };
}

export default CustomNodeInterface;
