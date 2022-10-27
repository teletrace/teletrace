import { Box, Checkbox } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

export default {
  component: Checkbox,
  title: 'Checkbox',
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Box>
    <Checkbox {...label} defaultChecked size="small" {...args} />
    <Checkbox {...label} defaultChecked {...args} />
    <Checkbox
      {...label}
      defaultChecked
      sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
      {...args}
    />
  </Box>
)

export const Primary = Template.bind({})
