import {
  Alert,
  Box,
  Button,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarOrigin,
  Stack,
} from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

export interface State extends SnackbarOrigin {
  open: boolean;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function PositionedSnackbar() {
  const [state, setState] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const buttons = (
    <>
      <Button
        onClick={handleClick({
          vertical: "top",
          horizontal: "center",
        })}
      >
        Top-Center
      </Button>
      <Button
        onClick={handleClick({
          vertical: "top",
          horizontal: "right",
        })}
      >
        Top-Right
      </Button>
      <Button
        onClick={handleClick({
          vertical: "bottom",
          horizontal: "right",
        })}
      >
        Bottom-Right
      </Button>
      <Button
        onClick={handleClick({
          vertical: "bottom",
          horizontal: "center",
        })}
      >
        Bottom-Center
      </Button>
      <Button
        onClick={handleClick({
          vertical: "bottom",
          horizontal: "left",
        })}
      >
        Bottom-Left
      </Button>
      <Button
        onClick={handleClick({
          vertical: "top",
          horizontal: "left",
        })}
      >
        Top-Left
      </Button>
    </>
  );

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {buttons}
      <Snackbar
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="sliding snack"
        key={vertical + horizontal}
      />
    </Box>
  );
}

type SnackbarStatus = "success" | "warning" | "error" | "info";

function StatusSnackbar() {
  const [open, setOpen] = useState<boolean>(false);

  const [status, setStatus] = useState<SnackbarStatus>("success");
  const statuses: SnackbarStatus[] = ["success", "warning", "error", "info"];

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    status: SnackbarStatus
  ): void => {
    setOpen(true);
    setStatus(status);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Stack direction="row">
        {statuses.map((status) => (
          <Button
            key={status}
            onClick={(event) => handleClick(event, status)}
          >{`${status}`}</Button>
        ))}
        <Snackbar
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={handleClose}
          autoHideDuration={1000}
          color={status}
        >
          <Alert severity={status}>{`this is a ${status} snackbar`}</Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}

export default {
  component: Snackbar,
  title: "Snackbar",
} as ComponentMeta<typeof Snackbar>;

const PositionedTemplate: ComponentStory<typeof Snackbar> = (args) => (
  <PositionedSnackbar {...args} />
);

export const Positions = PositionedTemplate.bind({});

const StatusTemplate: ComponentStory<typeof Snackbar> = (args) => (
  <StatusSnackbar {...args} />
);

export const Statuses = StatusTemplate.bind({});
