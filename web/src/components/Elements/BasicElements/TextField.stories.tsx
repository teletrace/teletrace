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

import { Stack, TextField, Typography } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: TextField,
  title: "TextField",
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
  <Stack spacing={2} sx={{ width: "20%" }}>
    <Typography variant="subtitle1" gutterBottom>
      Default Text Field size is small
    </Typography>
    <TextField label="default textfield" {...args} />
    <TextField size="medium" label="medium textfield" {...args} />
  </Stack>
);

const BasicTemplate: ComponentStory<typeof TextField> = (args) => (
  <Stack spacing={2} sx={{ width: "20%" }}>
    <TextField
      id="outlined-basic"
      label="Outlined"
      variant="outlined"
      {...args}
    />
    <TextField id="filled-basic" label="Filled" variant="filled" {...args} />
    <TextField
      id="standard-basic"
      label="Standard"
      variant="standard"
      {...args}
    />
  </Stack>
);

const TemplateFromProps: ComponentStory<typeof TextField> = (args) => (
  <Stack spacing={4}>
    <Stack direction="row" spacing={2}>
      <TextField
        required
        id="outlined-required"
        label="Required"
        defaultValue="Hello World"
        {...args}
      />
      <TextField
        disabled
        id="outlined-disabled"
        label="Disabled"
        defaultValue="Hello World"
        {...args}
      />
      <TextField
        id="outlined-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        size="small"
        {...args}
      />
      <TextField
        id="outlined-read-only-input"
        label="Read Only"
        defaultValue="Hello World"
        InputProps={{
          readOnly: true,
        }}
        {...args}
      />
      <TextField
        id="outlined-number"
        label="Number"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        {...args}
      />

      <TextField
        id="outlined-search"
        label="Search field"
        type="search"
        {...args}
      />
      <TextField
        id="outlined-helperText"
        label="Helper text"
        defaultValue="Default Value"
        helperText="Some important text"
        {...args}
      />
    </Stack>
    <Stack direction="row" spacing={2}>
      <TextField
        required
        id="filled-required"
        label="Required"
        defaultValue="Hello World"
        variant="filled"
        {...args}
      />
      <TextField
        disabled
        id="filled-disabled"
        label="Disabled"
        defaultValue="Hello World"
        variant="filled"
        {...args}
      />
      <TextField
        id="filled-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        variant="filled"
        {...args}
      />
      <TextField
        id="filled-read-only-input"
        label="Read Only"
        defaultValue="Hello World"
        InputProps={{
          readOnly: true,
        }}
        variant="filled"
        {...args}
      />
      <TextField
        id="filled-number"
        label="Number"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        {...args}
      />
      <TextField
        id="filled-search"
        label="Search field"
        type="search"
        variant="filled"
        {...args}
      />
      <TextField
        id="filled-helperText"
        label="Helper text"
        defaultValue="Default Value"
        helperText="Some important text"
        variant="filled"
        {...args}
      />
    </Stack>
    <Stack direction="row" spacing={2}>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="Hello World"
        variant="standard"
        {...args}
      />
      <TextField
        disabled
        id="standard-disabled"
        label="Disabled"
        defaultValue="Hello World"
        variant="standard"
        {...args}
      />
      <TextField
        id="standard-password-input"
        label="Password"
        type="password"
        autoComplete="current-password"
        variant="standard"
        {...args}
      />
      <TextField
        id="standard-read-only-input"
        label="Read Only"
        defaultValue="Hello World"
        InputProps={{
          readOnly: true,
        }}
        variant="standard"
        {...args}
      />
      <TextField
        id="standard-number"
        label="Number"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="standard"
        {...args}
      />
      <TextField
        id="standard-search"
        label="Search field"
        type="search"
        variant="standard"
        {...args}
      />
      <TextField
        id="standard-helperText"
        label="Helper text"
        defaultValue="Default Value"
        helperText="Some important text"
        variant="standard"
        {...args}
      />
    </Stack>
  </Stack>
);

export const Primary = Template.bind({});
export const Basic = BasicTemplate.bind({});
export const FromProps = TemplateFromProps.bind({});
