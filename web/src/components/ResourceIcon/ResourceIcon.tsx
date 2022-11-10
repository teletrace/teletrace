import React from "react";

import { ReactComponent as ApiGatewayEndpoint } from "@/styles/icons/ApiGatewayEndpoint.svg";
import { ReactComponent as DefaultResourceIcon } from "@/styles/icons/DefaultResourceIcon.svg";
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
  DefaultResourceIcon: DefaultResourceIcon,
};

export const ResourceIcon = (data: IconComponentProps) => {
  const { name } = data;
  const Icon = iconTypes[name] || iconTypes["DefaultResourceIcon"];
  return <Icon height={30} width={30} />;
};
