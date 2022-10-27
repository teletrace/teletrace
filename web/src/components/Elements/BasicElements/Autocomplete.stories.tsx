import { Autocomplete, Box, Stack, TextField } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

interface FilmOptionType {
  title: string
  year: number
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
]
function CustomizedAutocomplete() {
  const defaultProps = {
    options: top100Films,
    getOptionLabel: (option: string | FilmOptionType) =>
      typeof option === 'string' ? option : option.title,
  }
  const flatProps = {
    options: top100Films.map((option) => option.title),
  }
  const [value, setValue] = useState<FilmOptionType | null>(null)

  return (
    <Stack spacing={1} sx={{ width: 300 }}>
      <Autocomplete
        {...defaultProps}
        disablePortal
        id="combo-box-demo"
        options={top100Films}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
      <Autocomplete
        {...defaultProps}
        id="disable-close-on-select"
        disableCloseOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            label="disableCloseOnSelect"
            variant="standard"
          />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="clear-on-escape"
        clearOnEscape
        renderInput={(params) => (
          <TextField {...params} label="clearOnEscape" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disable-clearable"
        disableClearable
        renderInput={(params) => (
          <TextField {...params} label="disableClearable" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="include-input-in-list"
        includeInputInList
        renderInput={(params) => (
          <TextField
            {...params}
            label="includeInputInList"
            variant="standard"
          />
        )}
      />
      <Autocomplete
        {...flatProps}
        id="flat-demo"
        renderInput={(params) => (
          <TextField {...params} label="flat" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="controlled-demo"
        value={value}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:next-line
        onChange={(_event: any, newValue: FilmOptionType | null) =>
          setValue(newValue)
        }
        renderInput={(params) => (
          <TextField {...params} label="controlled" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="auto-complete"
        autoComplete
        includeInputInList
        renderInput={(params) => (
          <TextField {...params} label="autoComplete" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disable-list-wrap"
        disableListWrap
        renderInput={(params) => (
          <TextField {...params} label="disableListWrap" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="open-on-focus"
        openOnFocus
        renderInput={(params) => (
          <TextField {...params} label="openOnFocus" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="auto-highlight"
        autoHighlight
        renderInput={(params) => (
          <TextField {...params} label="autoHighlight" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="auto-select"
        autoSelect
        renderInput={(params) => (
          <TextField {...params} label="autoSelect" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disabled"
        disabled
        renderInput={(params) => (
          <TextField {...params} label="disabled" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disable-portal"
        disablePortal
        renderInput={(params) => (
          <TextField {...params} label="disablePortal" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="blur-on-select"
        blurOnSelect
        renderInput={(params) => (
          <TextField {...params} label="blurOnSelect" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="clear-on-blur"
        clearOnBlur
        renderInput={(params) => (
          <TextField {...params} label="clearOnBlur" variant="standard" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="select-on-focus"
        selectOnFocus
        renderInput={(params) => (
          <TextField {...params} label="selectOnFocus" variant="standard" />
        )}
      />
      <Autocomplete
        {...flatProps}
        id="readOnly"
        readOnly
        defaultValue={flatProps.options[13]}
        renderInput={(params) => (
          <TextField {...params} label="readOnly" variant="standard" />
        )}
      />
    </Stack>
  )
}

export default {
  component: Autocomplete,
  title: 'Autocomplete',
} as ComponentMeta<typeof Autocomplete>

const Template: ComponentStory<typeof Autocomplete> = (args) => (
  <Box>
    <CustomizedAutocomplete {...args} />
  </Box>
)

export const Primary = Template.bind({})
