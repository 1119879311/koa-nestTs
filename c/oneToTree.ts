let data1 = [
  { id: 3, pid: 2, name: "name3" },
  { id: 4, pid: 1, name: "name4" },
  { id: 1, pid: 0, name: "name1" },
  { id: 2, pid: 0, name: "name2" },
  { id: 5, pid: 4, name: "name5" },
  { id: 6, pid: 5, name: "name6" },
  { id: 7, pid: 5, name: "name6" },
  { id: 8, pid: 7, name: "name6" },
  { id: 9, pid: 7, name: "name6" },
];

//递归法：一维数组转无限极树状结构
/**
 *
 */
type IOption<T> = {
  idKey?: string;
  pidKey?: string;
  childKey?: string;
  callback?: (item: T, index: number) => void;
};
let count = 0;
function oneToTree<T extends Record<string, any>>(
  data: T[] = [],
  options: IOption<T> = {}
): unknown {
  if (!Array.isArray(data) || !data.length) return [];
  const {
    idKey = "id",
    pidKey = "pid",
    childKey = "children",
    callback,
  } = options;

  const mapIndex = data.reduce(
    (result: Record<any, number>, item: T, index: number) => {
      count++;
      result[item[idKey]] = index;
      return result;
    },
    {}
  );

  let result: T[] = [];
  data.forEach((item, index) => {
    callback?.(item, index);
    const parentIndex = mapIndex[item[pidKey]];
    // 顶层的
    if (parentIndex === undefined) {
      result.push(item);
    } else {
      let parentItem: Record<string, any> = data[parentIndex];
      if (!Array.isArray(parentItem[childKey])) {
        parentItem[childKey] = [];
      }
      parentItem[childKey].push(item);
    }
  });
  return result;
}

debugger;
let data2 = oneToTree(data1);
console.log(JSON.stringify(data2, null, 2), data2, count);
