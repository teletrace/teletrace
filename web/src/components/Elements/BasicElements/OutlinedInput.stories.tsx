import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: OutlinedInput,
  title: "OutlinedInput",
} as ComponentMeta<typeof OutlinedInput>;

const BasicTemplate: ComponentStory<typeof OutlinedInput> = (args) => (
  <Box
    component="form"
    sx={{
      "& .MuiOutlinedInput-root": { m: 1, width: "25ch" },
    }}
  >
    <OutlinedInput
      id="outlined-adornment-weight"
      endAdornment={<InputAdornment position="end">kg</InputAdornment>}
      aria-describedby="outlined-weight-helper-text"
      inputProps={{
        "aria-label": "weight",
      }}
      {...args}
    />
  </Box>
);

export const Basic = BasicTemplate.bind({});
