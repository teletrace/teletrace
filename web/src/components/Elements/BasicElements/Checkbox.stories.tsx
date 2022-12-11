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
      <Checkbox {...label} disabled defaultChecked {...args} />
    </Stack>
  </Stack>
);

export const Primary = Template.bind({});
