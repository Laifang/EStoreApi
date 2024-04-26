import { FormGroup, FormLabel, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
  items: string[];
  checkedItemsInStore: string[];
  onChange: (itmes: string[]) => void;
  filterTitle?: string;
}

// 实现思路:
// 1. 接收items参数，里面包含了所有可选的选项
// 2. 接收checkedItemsInStore参数，里面包含了redux store中存储的 当前已选中的选项,这是用来刷新页面的
// 3. 接收onChange参数，当选项被选中或取消时，会调用这个函数，并传入新的选中选项数组 到 Redux store中,用来触发刷新页面
// 4. 实现一个handleChecked函数，用来处理单个选项的选中或取消事件, 并更新组件内部的checkedItems状态，并调用onChange函数

const CheckboxGroup = ({ items, checkedItemsInStore, onChange, filterTitle }: Props) => {
  // 设定组件内部的状态，用于控制复选框的选中状态，他是一个数组，里面包含了所有可选的选项,
  // 初始值为传入的checked参数，如果checked参数为空，则初始化为空数组,表示没有任何选项被选中
  const [checkedItems, setCheckedItems] = useState(checkedItemsInStore || []);

  const handleChecked = (value: string) => {
    // 实现思路: 每个checkbox 都会携带自身value值，我们可以通过这个值来判断当前checkbox是否被选中，
    let newChecked: string[] = [];
    if (checkedItems.includes(value)) {
      // 如果value已存在，则过滤掉这个值, 实现取消选中
      newChecked = checkedItems.filter((item: string) => item !== value);
    } else {
      // 如果value不存在，则添加这个值
      newChecked = [...checkedItems, value];
    }
    setCheckedItems(newChecked);
    // 调用onChange函数，传入新的选中选项数组，触发刷新页面
    onChange(newChecked);
  };

  return (
    <FormGroup>
      {filterTitle && <FormLabel>{filterTitle}</FormLabel>} {/* 标题按需显示 */}
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={<Checkbox checked={checkedItems.includes(item)} onClick={() => handleChecked(item)} />}
          label={item}
        />
      ))}
    </FormGroup>
  );
};

export default CheckboxGroup;
