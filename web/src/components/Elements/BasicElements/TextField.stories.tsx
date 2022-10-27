import { Box, TextField } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  component: TextField,
  title: 'TextField',
} as ComponentMeta<typeof TextField>

const Template: ComponentStory<typeof TextField> = (args) => (
  <TextField {...args} />
)

const BasicTemplate: ComponentStory<typeof TextField> = (args) => (
  <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
  >
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
  </Box>
)

const TemplateFromProps: ComponentStory<typeof TextField> = (args) => (
  <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
  >
    <div>
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
    </div>
    <div>
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
    </div>
    <div>
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
    </div>
  </Box>
)

export const Primary = Template.bind({})
export const Basic = BasicTemplate.bind({})
export const FromProps = TemplateFromProps.bind({})
