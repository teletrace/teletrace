import { Button, Stack, Typography } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: Typography,
  title: "Typography",
} as ComponentMeta<typeof Typography>;

const Template: ComponentStory<typeof Typography> = () => (
  <Stack spacing={2} sx={{ width: "100%" }}>
    <Typography variant="h1">h1. Heading</Typography>
    <Typography variant="h2">h2. Heading</Typography>
    <Typography variant="h3">h3. Heading</Typography>
    <Typography variant="h4">h4. Heading</Typography>
    <Typography variant="h5">h5. Heading</Typography>
    <Typography variant="h6">h6. Heading</Typography>
    <Typography variant="subtitle1">
      subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
      blanditiis tenetur
    </Typography>
    <Typography variant="subtitle2">
      subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
      blanditiis tenetur
    </Typography>
    <Typography variant="body1">
      body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
      blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
      neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti?
      Eum quasi quidem quibusdam.
    </Typography>
    <Typography variant="body2">
      body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
      blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
      neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti?
      Eum quasi quidem quibusdam.
    </Typography>
    <Typography variant="caption" display="block">
      caption text
    </Typography>
    <Typography variant="overline" display="block">
      overline text
    </Typography>
  </Stack>
);

export const Primary = Template.bind({});
