import FormControl from "@mui/material/FormControl";
import { styles } from "./styles";
import {
  ValueTypes,
  ValueInputMode,
  SearchRequest,
} from "../../types/spanQuery";
import {
  Autocomplete,
  FormLabel,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTagValues } from "../../api/tagValues";
import { formatNumber } from "@/utils/format";
import { TagValue, TagValuesRequest } from "../../types/tagValues";

export type ValueSelectorProps = {
  tag: string;
  query?: TagValuesRequest;
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
  const tagValuesRequest =
    query ??
    ({
      timeframe: {
        startTime: 0,
        endTime: new Date().valueOf(),
      },
    } as TagValuesRequest);

  const { data: tagValues } = useTagValues(tag, tagValuesRequest);

  // const tagOptions = tagValues?.pages.flatMap((page) => page.values).sort((a, b) => b.count - a.count);

  // TODO shaqued: delete
  const tagOptions = [
    {
      value: "valA",
      count: 5,
    },
    {
      value: "valB",
      count: 10,
    },
    {
      value: "valC",
      count: 1,
    },
  ].sort((a, b) => b.count - a.count);

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

  return (
    <>
      <FormControl sx={styles.valueSelector}>
        <FormLabel>Value</FormLabel>
        {valueInputMode === "select" ? (
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
                  <Typography>{formatNumber(option.count)}</Typography>
                </Stack>
              </ListItem>
            )}
            renderInput={(params) => <TextField {...params} />}
            onChange={handleSelectChange}
          ></Autocomplete>
        ) : null}
        {valueInputMode === "text" ? (
          <TextField
            variant="outlined"
            value={value}
            onChange={handleInputChange}
          />
        ) : null}
        {valueInputMode === "numeric" ? (
          <TextField
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
