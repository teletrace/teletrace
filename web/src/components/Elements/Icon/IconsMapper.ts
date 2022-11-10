import Custom from "./icons/Custom";
import DynamoDB from "./icons/DynamoDB";
import Grpc from "./icons/Grpc";
import Http from "./icons/Http";
import Lambda from "./icons/Lambda";
import MongoDB from "./icons/MongoDB";
import { NodeJSIcon } from "./icons/NodeJSIcon";
import Python from "./icons/Python";
import RabbitMQ from "./icons/RabbitMQ";
import Redis from "./icons/Redis";
import SNS from "./icons/Sns";
import Sqs from "./icons/Sqs";

export const IconsMapper = (type: string | undefined) => {
  switch (type) {
    case "http":
      return Http;
    case "grpc":
      return Grpc;
    case "redis":
      return Redis;
    case "rabbitmq":
      return RabbitMQ;
    case "python":
      return Python;
    case "mongodb":
      return MongoDB;
    case "dynamodb":
      return DynamoDB;
    case "Lambda":
      return Lambda;
    case "sns":
    case "SNS":
      return SNS;
    case "sqs":
    case "SQS":
      return Sqs;
    case "nodejs":
    case "node":
      return NodeJSIcon;
    case "generic": // server fallback scenario
      return Custom;
    default:
      return Custom;
  }
};

export default IconsMapper;
