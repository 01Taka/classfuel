import { useState } from "react";

const useArrayState = <T>(initialState: T[] = []) => {
  const [array, setArray] = useState<T[]>(initialState);

  const push = (data: T, index: number = array.length) => {
    if (index < 0 || index > array.length) {
      console.error(`Invalid index ${index} for push operation.`);
      return;
    }
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 0, data);
      return newArray;
    });
  };

  const pop = (index: number = array.length - 1) => {
    if (index < 0 || index >= array.length) {
      console.error(`Invalid index ${index} for pop operation.`);
      return;
    }
    setArray((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  const update = (index: number, newData: T) => {
    if (index < 0 || index >= array.length) {
      console.error(`Invalid index ${index} for update operation.`);
      return;
    }
    setArray((prevArray) => prevArray.map((item, i) => (i === index ? newData : item)));
  };

  const remove = (data: T) => {
    setArray((prevArray) => prevArray.filter((item) => item !== data));
  };

  const find = (predicate: (item: T) => boolean) => {
    return array.find(predicate);
  };

  const contains = (data: T) => {
    return array.includes(data);
  };

  const replaceAll = (newArray: T[]) => {
    setArray(newArray);
  };

  const clear = () => setArray([]);

  return { array, push, pop, update, remove, find, contains, replaceAll, clear };
};

export default useArrayState;
