import { Add } from "@mui/icons-material";
import { Slider, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: Slider,
  title: "Slider",
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => {
  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 100,
      label: "100",
    },
  ];
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width="100px">Normal</TableCell>
            <TableCell>
              <Slider id="normal" defaultValue={60} {...args} />
            </TableCell>
            <TableCell>
              <Slider id="normal" size="small" defaultValue={60} {...args} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width="100px">Steps</TableCell>
            <TableCell>
              <Slider
                id="normal"
                defaultValue={60}
                step={10}
                marks={true}
                min={0}
                max={100}
                {...args}
              />
            </TableCell>
            <TableCell>
              <Slider
                id="normal"
                size="small"
                defaultValue={60}
                step={10}
                marks={true}
                min={0}
                max={100}
                {...args}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width="100px">Custom Marks</TableCell>
            <TableCell>
              <Slider
                id="normal"
                defaultValue={60}
                step={10}
                marks={marks}
                min={0}
                max={100}
                {...args}
              />
            </TableCell>
            <TableCell>
              <Slider
                id="normal"
                size="small"
                defaultValue={60}
                step={10}
                marks={marks}
                min={0}
                max={100}
                {...args}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width="100px">Label Display</TableCell>
            <TableCell>
              <Slider
                id="normal"
                defaultValue={60}
                step={10}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                {...args}
              />
            </TableCell>
            <TableCell>
              <Slider
                id="normal"
                size="small"
                defaultValue={60}
                step={10}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                {...args}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width="100px">Range</TableCell>
            <TableCell>
              <Slider
                id="normal"
                defaultValue={[20, 40]}
                step={10}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                {...args}
              />
            </TableCell>
            <TableCell>
              <Slider
                id="normal"
                size="small"
                defaultValue={[20, 40]}
                step={10}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                {...args}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width="100px">Disabled</TableCell>
            <TableCell>
              <Slider
                id="normal"
                defaultValue={[20, 40]}
                step={10}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                disabled
                {...args}
              />
            </TableCell>
            <TableCell>
              <Slider
                id="normal"
                size="small"
                defaultValue={[20, 40]}
                step={10}
                marks={marks}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                disabled
                {...args}
              />
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
export const Secondary = Template.bind({});

{
  /* <TableCell><Button id="focused" startIcon={<Add/>} variant="contained" {...args}>Button</Button></TableCell>
<TableCell><Button id="focused" endIcon={<Add/>} variant="contained" {...args}>Button</Button></TableCell> */
}

Primary.args = {
  color: "primary",
};
Primary.parameters = Parameters;

Secondary.args = {
  color: "secondary",
};
Secondary.parameters = Parameters;
