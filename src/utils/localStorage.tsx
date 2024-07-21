
import { ColumnType } from "../Column";
export const saveToLocalStorage = (key: string, value: ColumnType[], counter: number) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem("counter", JSON.stringify(counter));
  } catch(error){
    console.error("データの保存中にエラーが発生しました: ", error);
  }
};
export const getComplexDataFromLocalStorage = (key: string): ColumnType[] | [] => {
  const columnData = localStorage.getItem(key);
  return columnData ? JSON.parse(columnData) : [];
};

export const getComplexDataFromLocalCounter = (key: string): Number | null => {
  const counter = localStorage.getItem(key);
  var num_counter = Number(counter);
  return num_counter ? num_counter : 1;
};