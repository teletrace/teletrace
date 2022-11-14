import FormControl from "@mui/material/FormControl";
import { styles } from "./styles";
import {
  ValueTypes,
  ValueInputMode,
  SearchRequest,
} from "../../types/spanQuery";
import {
  Autocomplete,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTagValues } from "../../api/tagValues";
import { formatNumber } from "@/utils/format";
import { TagValue } from "../../types/tagValues";

export type ValueSelectorProps = {
  tag: string;
  query?: SearchRequest;
  value: ValueTypes;
  valueInputMode: ValueInputMode;
  onChange: (value: ValueTypes) => void;
};

export const ValueSelector = ({
  tag,
  query,
  value,
  valueInputMode,
  onChange,
}: ValueSelectorProps) => {
  const { data: tagValues } = useTagValues(tag, query);

  // const tagOptions = tagValues?.pages.flatMap((page) => page.values).sort((a, b) => b.occurrences - a.occurrences);

  // TODO shaqued: delete
  const tagOptions = [
    {
      value: "valA",
      occurrences: 5,
    },
    {
      value: "valB",
      occurrences: 10,
    },
    {
      value: "valC",
      occurrences: 1,
    },
  ].sort((a, b) => b.occurrences - a.occurrences);

  const handleInputChange = (event: any) => {
    onChange(event?.target?.value ?? "");
  };

  const handleSelectChange = (event: any, value: TagValue[]) => {
    onChange(value.map((v) => v.value.toString()));
  };

  const getSelectedValues = () => {
    const valueArray = value instanceof Array ? value : [value.toString()];
    return (
      tagOptions?.filter((tagOption) =>
        valueArray.includes(tagOption.value.toString())
      ) || []
    );
  };

  if (valueInputMode === "select")
    return (
      <FormControl sx={styles.valueSelector}>
        <Autocomplete
          multiple
          disableCloseOnSelect
          value={getSelectedValues()}
          id={"value-selector"}
          options={tagOptions || []}
          getOptionLabel={(option) => option.value.toString()}
          renderOption={(props, option) => (
            <ListItem {...props}>
              <Stack
                sx={{ width: "100%" }}
                direction="row"
                justifyContent="space-between"
              >
                <Typography>{option.value}</Typography>
                <Typography>{formatNumber(option.occurrences)}</Typography>
              </Stack>
            </ListItem>
          )}
          renderInput={(params) => <TextField {...params} label="Value" />}
          onChange={handleSelectChange}
        ></Autocomplete>
      </FormControl>
    );

  if (valueInputMode === "text")
    return (
      <TextField
        label="Value"
        variant="outlined"
        value={value}
        onChange={handleInputChange}
      />
    );
  if (valueInputMode === "numeric")
    return (
      <TextField
        label="Value"
        variant="outlined"
        type="number"
        value={value}
        onChange={handleInputChange}
      />
    );
  return null;
};
