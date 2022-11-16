import { Autocomplete, FormLabel, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

import { useAvailableTags } from "../../api/availableTags";
import { availableTag } from "../../types/availableTags";
import { styles } from "./styles";

interface FilterSelectorProps {
  filter: availableTag | null;
  onChange: (f: availableTag | null) => void;
  error: boolean;
}

export const FilterSelector = ({
  filter,
  onChange,
  error,
}: FilterSelectorProps) => {
  const { data: availableTags } = useAvailableTags();

  const availableTagsOptions = availableTags?.pages.flatMap(
    (page) => page.tags
  );

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: availableTag | null
  ) => {
    onChange(value);
  };

  return (
    <FormControl required sx={styles.filterSelector}>
      <FormLabel required={false}>Key</FormLabel>
      <Autocomplete
        value={filter}
        id="filter"
        size="small"
        options={availableTagsOptions || []}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={error ? "filter is required" : ""}
          />
        )}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.name === value.name}
      ></Autocomplete>
    </FormControl>
  );
};
