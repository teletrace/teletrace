import { Autocomplete, FormLabel, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";

import { useAvailableTags } from "../../api/availableTags";
import { AvailableTag } from "../../types/availableTags";
import { styles } from "./styles";

export type FilterSelectorProps = {
  value: AvailableTag | null;
  onChange: (f: AvailableTag | null) => void;
  error: boolean;
};

export const FilterSelector = ({
  value,
  onChange,
  error,
}: FilterSelectorProps) => {
  const { data: availableTags, isLoading } = useAvailableTags();

  const availableTagsOptions = availableTags?.pages.flatMap(
    (page) => page.Tags
  );

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: AvailableTag | null
  ) => {
    onChange(value);
  };

  return (
    <FormControl required sx={styles.filterSelector}>
      <FormLabel required={false}>Key</FormLabel>
      <Autocomplete
        loading={isLoading}
        value={value}
        id="filter"
        size="small"
        options={availableTagsOptions || []}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={error ? "Filter is required" : ""}
          />
        )}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.name === value.name}
      ></Autocomplete>
    </FormControl>
  );
};
