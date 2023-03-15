/**
 * Copyright 2022 Cisco Systems, Inc.
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

import { Info, Refresh } from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useHasSpans } from "../../api/spanQuery";
import { LinkButton } from "./LinkButton";
import { ReactComponent as RocketIcon } from "./rocket_icon.svg";

export const EmptyState = () => {
  const { refetch } = useHasSpans();

  return (
    <Stack style={{ width: "100%" }} spacing="20px">
      <Stack direction="row" spacing={1}>
        <Paper
          variant="outlined"
          sx={{
            height: 56,
            width: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RocketIcon />
        </Paper>

        <div>
          <Typography
            sx={{
              fontSize: 20,
              lineHeight: "28px",
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            Start sending data to Teletrace
          </Typography>
          <Typography color="text.secondary">
            Teletrace is leveraging OpenTelemetry as an open-source standard for
            collecting high-quality telemetry data from microservices.
          </Typography>
        </div>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent sx={{ padding: "20px", paddingBottom: 0 }}>
            <Typography variant="h5" sx={{ fontSize: 16, fontWeight: 600 }}>
              Already using OpenTelemetry?
            </Typography>
            <Typography color="text.secondary">
              If you already have OpenTelemetry setup on your applications, you
              can configure it to send data to Teletrace.
            </Typography>
          </CardContent>

          <CardActions sx={{ padding: "20px", paddingTop: "16px" }}>
            <LinkButton href="https://docs.teletrace.io/user-guide/sending-data/open_telemetry_collector/">
              OpenTelemetry Collector
            </LinkButton>
          </CardActions>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent sx={{ padding: "20px", paddingBottom: 0 }}>
            <Typography variant="h5" sx={{ fontSize: 16, fontWeight: 600 }}>
              Don’t have OpenTelemetry yet?
            </Typography>
            <Typography color="text.secondary">
              You can send traces to Teletrace directly from your code using an
              OTLP Trace Exporter.
            </Typography>
          </CardContent>

          <CardActions sx={{ padding: "20px", paddingTop: "16px" }}>
            <LinkButton href="https://docs.teletrace.io/user-guide/sending-data/open-telemetry-sdk/java/">
              Java
            </LinkButton>
            <LinkButton href="https://docs.teletrace.io/user-guide/sending-data/open-telemetry-sdk/javascript/">
              JavaScript
            </LinkButton>
            <LinkButton href="https://docs.teletrace.io/user-guide/sending-data/open-telemetry-sdk/python/">
              Python
            </LinkButton>
            <LinkButton href="https://opentelemetry.io/docs/instrumentation/go/">
              Go
            </LinkButton>
            <LinkButton href="https://opentelemetry.io/docs/instrumentation/">
              Other
            </LinkButton>
          </CardActions>
        </Card>
      </Stack>

      <Alert
        severity="info"
        variant="outlined"
        icon={<Info />}
        action={
          <Button onClick={() => refetch()} startIcon={<Refresh />}>
            Refresh
          </Button>
        }
        sx={{
          color: "white",
          borderColor: "#548CFF",
          backgroundColor: "rgba(84, 140, 255, 0.12)",
        }}
      >
        Once you will finish, please refresh the page to see your spans
      </Alert>
    </Stack>
  );
};
