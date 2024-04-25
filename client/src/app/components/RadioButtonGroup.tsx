import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";

interface Props {
  sortOptions: { value: string; label: string }[]; // sortOption 的 类型是 对象数组
  handleOnChange: (event: any) => void;
  selectedValue: string;
}

function RadioButtonGroup({ sortOptions, handleOnChange, selectedValue }: Props) {
  return (
    <FormControl component="fieldset">
      <FormLabel>排序</FormLabel>
      <RadioGroup value={selectedValue} onChange={handleOnChange}>
        {sortOptions.map(({ value, label }) => (
          <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default RadioButtonGroup;
