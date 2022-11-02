export interface NodeData {
  name: string;
  image: string;
  type: string;
}

export interface EdgeData {
  time: string;
  count?: number;
}

export interface IconComponentProps {
  name: string;
}

export interface BasicNodeProps {
  image: string;
  name: string;
  type: string;
}
