import React from "react";

import { IconComponentProps } from "@/components/Graph/types";
import { ReactComponent as ApiGatewayEndpoint } from "@/styles/icons/ApiGatewayEndpoint.svg";
import { ReactComponent as DefaultIcon } from "@/styles/icons/DefaultIcon.svg";
import { ReactComponent as IoTHTTP2Protocol } from "@/styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "@/styles/icons/LambdaFunction.svg";

type ReactSVGComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

type IconTypes = { [name: string]: ReactSVGComponent };

const iconTypes: IconTypes = {
  LambdaFunction: LambdaFunction,
  ApiGatewayEndpoint: ApiGatewayEndpoint,
  IoTHTTP2Protocol: IoTHTTP2Protocol,
  DefaultIcon: DefaultIcon,
};

export const NodeIcon = (data: IconComponentProps) => {
  const { name } = data;
  const Icon = iconTypes[name] || iconTypes["DefaultIcon"];
  return <Icon height={30} width={30} />;
};
