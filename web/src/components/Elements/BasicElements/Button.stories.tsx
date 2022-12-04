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

import { Add } from "@mui/icons-material";
import { Button, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: Button,
  title: "Button",
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => {
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Normal</TableCell>
            <TableCell>
              <Button id="normal" size="large" variant="contained" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="normal" variant="contained" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="normal" variant="contained" size="small" {...args}>
                Button
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Hovered</TableCell>
            <TableCell>
              <Button id="hovered" variant="contained" size="large" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="hovered" variant="contained" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="hovered" variant="contained" size="small" {...args}>
                Button
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pressed</TableCell>
            <TableCell>
              <Button id="pressed" variant="contained" size="large" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="pressed" variant="contained" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="pressed" variant="contained" size="small" {...args}>
                Button
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Disabled</TableCell>
            <TableCell>
              <Button
                id="disabled"
                variant="contained"
                disabled
                size="large"
                {...args}
              >
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="disabled" variant="contained" disabled {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button
                id="disabled"
                variant="contained"
                disabled
                size="small"
                {...args}
              >
                Button
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Focused</TableCell>
            <TableCell>
              <Button id="focused" variant="contained" size="large" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="focused" variant="contained" {...args}>
                Button
              </Button>
            </TableCell>
            <TableCell>
              <Button id="focused" size="small" variant="contained" {...args}>
                Button
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const Parameters = {
  pseudo: {
    hover: ["#hovered"],
    focus: ["#focused"],
    active: ["#pressed"],
  },
};

export const Primary = Template.bind({});
export const PrimaryStartIcon = Template.bind({});
export const PrimaryEndIcon = Template.bind({});
export const Secondary = Template.bind({});
export const Error = Template.bind({});

Primary.args = {
  color: "primary",
};
Primary.parameters = Parameters;

PrimaryStartIcon.args = {
  color: "primary",
  startIcon: <Add />,
};
PrimaryStartIcon.parameters = Parameters;

PrimaryEndIcon.args = {
  color: "primary",
  endIcon: <Add />,
};
PrimaryEndIcon.parameters = Parameters;

Secondary.args = {
  color: "secondary",
};
Secondary.parameters = Parameters;

Error.args = {
  color: "error",
};
Error.parameters = Parameters;
