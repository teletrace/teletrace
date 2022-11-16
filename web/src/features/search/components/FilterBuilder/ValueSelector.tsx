import {
  Autocomplete,
  FormLabel,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";

import { formatNumber } from "@/utils/format";

import { useTagValues } from "../../api/tagValues";
import { ValueInputMode, ValueTypes } from "../../types/spanQuery";
import { TagValue, TagValuesRequest } from "../../types/tagValues";
import { styles } from "./styles";

export type ValueSelectorProps = {
  tag: string;
  query?: TagValuesRequest;
  value: ValueTypes;
  valueInputMode: ValueInputMode;
  onChange: (value: ValueTypes) => void;
  error: boolean;
};

export const ValueSelector = ({
  tag,
  query,
  value,
  valueInputMode,
  onChange,
  error,
}: ValueSelectorProps) => {
  const tagValuesRequest =
    query ??
    ({
      timeframe: {
        startTime: 0,
        endTime: new Date().valueOf(),
      },
    } as TagValuesRequest);

  const { data: tagValues, isLoading } = useTagValues(tag, tagValuesRequest);

  const tagOptions = tagValues?.pages
    .flatMap((page) => page.values)
    .sort((a, b) => b.count - a.count);

  const errorHelperText = error ? "Value is required" : "";

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(event?.target?.value ?? "");
  };

  const handleSelectChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: TagValue[]
  ) => {
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

  return (
    <>
      <FormControl required sx={styles.valueSelector}>
        <FormLabel required={false}>Value</FormLabel>
        {valueInputMode === "select" ? (
          <Autocomplete
            multiple
            size="small"
            loading={isLoading}
            disableCloseOnSelect
            value={getSelectedValues()}
            id={"value-selector"}
            options={tagOptions || []}
            getOptionLabel={(option) => option.value.toString()}
            renderInput={(params) => (
              <TextField
                error={error}
                helperText={errorHelperText}
                {...params}
              />
            )}
            renderOption={(props, option) => (
              <ListItem {...props}>
                <Stack
                  sx={{ width: "100%" }}
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>{option.value}</Typography>
                  <Typography>{formatNumber(option.count)}</Typography>
                </Stack>
              </ListItem>
            )}
            onChange={handleSelectChange}
          ></Autocomplete>
        ) : null}
        {valueInputMode === "text" ? (
          <TextField
            error={error}
            helperText={errorHelperText}
            size="small"
            variant="outlined"
            value={value}
            onChange={handleInputChange}
          />
        ) : null}
        {valueInputMode === "numeric" ? (
          <TextField
            error={error}
            helperText={errorHelperText}
            size="small"
            variant="outlined"
            type="number"
            value={value}
            onChange={handleInputChange}
          />
        ) : null}
      </FormControl>
    </>
  );
};
