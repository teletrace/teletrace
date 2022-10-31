import React from "react";

import { ReactComponent as ApiGatewayEndpoint } from "@/styles/icons/ApiGatewayEndpoint.svg";
import { ReactComponent as IoTHTTP2Protocol } from "@/styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "@/styles/icons/LambdaFunction.svg";

interface IconComponentProps {
  name: string;
}

type ReactSVGComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

type IconTypes = { [name: string]: ReactSVGComponent };

const iconTypes: IconTypes = {
  LambdaFunction: LambdaFunction,
  ApiGatewayEndpoint: ApiGatewayEndpoint,
  IoTHTTP2Protocol: IoTHTTP2Protocol,
};

const NodeIcon = ({ name }: IconComponentProps) => {
  const Icon = iconTypes[name];
  return Icon ? <Icon height={30} width={30} /> : <div></div>;
};

export default NodeIcon;
