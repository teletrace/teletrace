import { Switch, FormGroup, FormControlLabel } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: Switch,
  title: "Switch",
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = () => {
  return (
    <FormGroup>
      <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
      <FormControlLabel disabled control={<Switch />} label="Disabled" />
    </FormGroup>
  );
};

export const Primary = Template.bind({});
export const Secondary = Template.bind({});

Primary.args = {
  color: "primary",
};

Secondary.args = {
  color: "secondary",
};
