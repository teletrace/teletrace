import { Button, Popover, Typography } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

export default {
  component: Popover,
  title: 'Popover',
} as ComponentMeta<typeof Popover>

const Template: ComponentStory<typeof Popover> = (args) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        {...args}
        open={open}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </div>
  )
}

export const Primary = Template.bind({})
export const Secondary = Template.bind({})

Primary.args = {
  color: 'primary',
}

Secondary.args = {
  color: 'secondary',
}
