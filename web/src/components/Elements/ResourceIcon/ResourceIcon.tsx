/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
import { ReactComponent as Slack } from "./icons/Slack.svg";
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
  slack: Slack,
};

export const ResourceIcon = ({ name, style }: ResourceIconProps) => {
  const Icon = iconTypes[name] || iconTypes["defaultresourceicon"];
  return <Icon style={style} />;
};
