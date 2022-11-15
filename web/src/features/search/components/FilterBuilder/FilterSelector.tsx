import FormControl from "@mui/material/FormControl";
import { styles } from "./styles";
import { useAvailableTags } from "../../api/availableTags";
import { availableTag } from "../../types/availableTags";
import { Autocomplete, FormLabel, TextField } from "@mui/material";

interface FilterSelectorProps {
  filter: availableTag | null;
  onChange: (f: availableTag | null) => void;
}

export const FilterSelector = ({ filter, onChange }: FilterSelectorProps) => {
  const { data: availableTags } = useAvailableTags();

  // const availableTagsOptions = availableTags?.pages
  //   .flatMap((page) => page.tags)
  //   ?.filter((tag) => tag.name.includes(search));

  const availableTagsOptions: availableTag[] = [
    { name: "resource.name", type: "string" },
    { name: "resource.type", type: "string" },
  ];

  const handleChange = (event: any, value: availableTag | null) => {
    onChange(value);
  };

  return (
    <FormControl sx={styles.filterSelector}>
      <FormLabel>Key</FormLabel>
      <Autocomplete
        value={filter}
        id="filter"
        options={availableTagsOptions}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} />}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.name === value.name}
      ></Autocomplete>
    </FormControl>
  );
};
