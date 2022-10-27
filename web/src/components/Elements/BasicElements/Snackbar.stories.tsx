import { Box, Button, Snackbar, SnackbarOrigin } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'


export interface State extends SnackbarOrigin {
  open: boolean
}

function PositionedSnackbar() {
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  })
  const { vertical, horizontal, open } = state

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ open: true, ...newState })
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  const buttons = (
    <>
      <Button
        onClick={handleClick({
          vertical: 'top',
          horizontal: 'center',
        })}
      >
        Top-Center
      </Button>
      <Button
        onClick={handleClick({
          vertical: 'top',
          horizontal: 'right',
        })}
      >
        Top-Right
      </Button>
      <Button
        onClick={handleClick({
          vertical: 'bottom',
          horizontal: 'right',
        })}
      >
        Bottom-Right
      </Button>
      <Button
        onClick={handleClick({
          vertical: 'bottom',
          horizontal: 'center',
        })}
      >
        Bottom-Center
      </Button>
      <Button
        onClick={handleClick({
          vertical: 'bottom',
          horizontal: 'left',
        })}
      >
        Bottom-Left
      </Button>
      <Button
        onClick={handleClick({
          vertical: 'top',
          horizontal: 'left',
        })}
      >
        Top-Left
      </Button>
    </>
  )

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {buttons}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        key={vertical + horizontal}
      />
    </Box>
  )
}

export default {
  component: Snackbar,
  title: 'Snackbar',
} as ComponentMeta<typeof Snackbar>

const Template: ComponentStory<typeof Snackbar> = (args) => (
  <PositionedSnackbar {...args} />
)

export const Primary = Template.bind({})
