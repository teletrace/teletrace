import { CSSProperties } from "react";

import { ReactComponent as ApiGatewayEndpoint } from "./icons/ApiGatewayEndpoint.svg";
import { ReactComponent as AWSLambdaFunction } from "./icons/AWSLambdaFunction.svg";
import { ReactComponent as Custom } from "./icons/Custom.svg";
import { ReactComponent as DefaultResourceIcon } from "./icons/DefaultResourceIcon.svg";
import { ReactComponent as DynamoDB } from "./icons/DynamoDB.svg";
import { ReactComponent as Grpc } from "./icons/Grpc.svg";
import { ReactComponent as Http } from "./icons/Http.svg";
import { ReactComponent as IoTHTTP2Protocol } from "./icons/IoTHTTP2Protocol.svg";
import { ReactComponent as Lambda } from "./icons/Lambda.svg";
import { ReactComponent as MongoDB } from "./icons/MongoDB.svg";
import { ReactComponent as NodeJS } from "./icons/NodeJSIcon.svg";
import { ReactComponent as Python } from "./icons/Python.svg";
import { ReactComponent as RabbitMQ } from "./icons/RabbitMQ.svg";
import { ReactComponent as Redis } from "./icons/Redis.svg";
import { ReactComponent as SNS } from "./icons/Sns.svg";
import { ReactComponent as SQS } from "./icons/Sqs.svg";

interface ResourceIconProps {
  name: string;
  style?: CSSProperties;
}

type ReactSVGComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

type IconTypes = { [name: string]: ReactSVGComponent };

const iconTypes: IconTypes = {
  apigatewayendpoint: ApiGatewayEndpoint,
  defaultresourceicon: DefaultResourceIcon,
  iothttp2protocol: IoTHTTP2Protocol,
  awslambdafunction: AWSLambdaFunction,
  lambdafunction: AWSLambdaFunction,
  lambda: Lambda,
  custom: Custom,
  dynamodb: DynamoDB,
  grpc: Grpc,
  http: Http,
  mongodb: MongoDB,
  nodejs: NodeJS,
  python: Python,
  rabbitmq: RabbitMQ,
  redis: Redis,
  sns: SNS,
  sqs: SQS,
};

export const ResourceIcon = ({ name, style }: ResourceIconProps) => {
  const Icon = iconTypes[name] || iconTypes["defaultresourceicon"];
  return <Icon style={style} />;
};
