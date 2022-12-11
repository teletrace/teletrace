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

import { FormControlLabel, FormGroup, Switch } from "@mui/material";
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
