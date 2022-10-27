import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, FormControlLabel, Switch } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'


export default {
  component: LoadingButton,
  title: 'LoadingButton',
} as ComponentMeta<typeof LoadingButton>

const Template: ComponentStory<typeof LoadingButton> = () => {
  const [loading, setLoading] = useState(true)
  const handleClick = () => {
    setLoading(true)
  }
  return (
    <div>
      <Box>
        <FormControlLabel
          sx={{
            display: 'block',
          }}
          control={
            <Switch
              checked={loading}
              onChange={() => setLoading(!loading)}
              name="loading"
              color="primary"
            />
          }
          label="Loading"
        />
        <Box sx={{ '& > button': { m: 1 } }}>
          <LoadingButton
            size="small"
            onClick={handleClick}
            loading={loading}
            variant="outlined"
            disabled
          >
            disabled
          </LoadingButton>
          <LoadingButton
            size="small"
            onClick={handleClick}
            loading={loading}
            loadingIndicator="Loading..."
            variant="outlined"
          >
            Fetch data
          </LoadingButton>
          <LoadingButton
            size="small"
            onClick={handleClick}
            loading={loading}
            loadingIndicator="Loading..."
            variant="contained"
          >
            Fetch data contained
          </LoadingButton>
          <LoadingButton
            size="small"
            onClick={handleClick}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Send
          </LoadingButton>
          <LoadingButton
            size="small"
            color="secondary"
            onClick={handleClick}
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Save
          </LoadingButton>
        </Box>

        <Box sx={{ '& > button': { m: 1 } }}>
          <LoadingButton
            onClick={handleClick}
            loading={loading}
            variant="outlined"
            disabled
          >
            disabled
          </LoadingButton>
          <LoadingButton
            onClick={handleClick}
            loading={loading}
            loadingIndicator="Loading..."
            variant="outlined"
          >
            Fetch data
          </LoadingButton>
          <LoadingButton
            onClick={handleClick}
            loading={loading}
            loadingIndicator="Loading..."
            variant="contained"
          >
            Fetch data contained
          </LoadingButton>
          <LoadingButton
            onClick={handleClick}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Send
          </LoadingButton>
          <LoadingButton
            color="secondary"
            onClick={handleClick}
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
      )
    </div>
  )
}

export const Primary = Template.bind({})

Primary.args = {
  color: 'primary',
}
