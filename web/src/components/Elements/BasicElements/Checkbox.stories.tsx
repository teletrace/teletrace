import { Checkbox, Stack } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default {
  component: Checkbox,
  title: "Checkbox",
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Stack spacing={2}>
    <Stack direction="row" spacing={1}>
      <Checkbox {...label} defaultChecked size="small" {...args} />
      <Checkbox {...label} defaultChecked {...args} />
      <Checkbox
        {...label}
        defaultChecked
        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
        {...args}
      />
    </Stack>
    <Stack direction="row" spacing={1}>
      <Checkbox {...label} disabled size="small" {...args} />
      <Checkbox {...label} disabled {...args} />
    </Stack>
  </Stack>
);

export const Primary = Template.bind({});
