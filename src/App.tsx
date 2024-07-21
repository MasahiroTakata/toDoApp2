import './App.css';
import { // ドラッグ&ドロップで必要なモジュールをインポート
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import React, { useState, useEffect, useRef } from 'react';
import Column, { ColumnType } from "./Column";
import { saveToLocalStorage, getComplexDataFromLocalStorage, getComplexDataFromLocalCounter} from './utils/localStorage';

function App() {
  const handleAddTask = (columnId: string, taskName: string) => {
    if (taskName.trim() !== '') {
      setSavedData(prevData => 
        prevData.map(column => 
          column.id === columnId
            ? { ...column, cards: [...column.cards, { id: String(count), title: taskName }] }
            : column
        )
      );
      setCounter(prevCount => prevCount + 1); // prevをつけることで、countの前の値を読み込んでくれてるっぽい
    }
  };

  const savedData = getComplexDataFromLocalStorage("task");
  const counter = getComplexDataFromLocalCounter("counter");
  // localStorage.removeItem("task");
  // localStorage.removeItem("counter");
  const [count, setCounter] = useState<number>(Number(counter)); // 入力したタスクにIDを振るためのcount
  const [data, setSavedData] = useState<ColumnType[]>(savedData.length ? savedData : [
    {
      id: "Column1",
      title: "未着手",
      cards: [],
      onAddTask: handleAddTask,
    },
    {
      id: "Column2",
      title: "着手中",
      cards: [],
      onAddTask: handleAddTask,
    },
    {
      id: "Column3",
      title: "完了",
      cards: [],
      onAddTask: handleAddTask,
    }
  ]);
  useEffect(() => { // 依存配列を空にすれば、一回しか呼ばれない（つまり、初期表示のみ呼ばれる）
    if(counter !== 1){
      setSavedData(savedData);
      setCounter(Number(counter));
      setColumns(data);
    }
  }, []);
  const [columns, setColumns] = useState<ColumnType[]>(data); // タスクを配置するスペースの更新関数（初期値はdata）
  const isFirstRender = useRef(true);
  useEffect(() => { // dataとcountが更新されたら呼ばれる
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }
    setColumns(data);
    saveToLocalStorage("task", data, count);
  }, [data, count]);

  const findColumn = (unique: string | null) => { // uniqueという引数がstring型もしくはnull
    if (!unique) {
      return null;
    }
    // overの対象がcolumnの場合があるためそのままidを返す
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.cards.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };
  // タスクをドラッグしている状態（他タスクと重なった時などに挙動を起こすコンポーネント）
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null; // ドラッグしたカードID（ドラッグして重なった時も、重ねられたカードIDも表示される）
    const activeColumn = findColumn(activeId); // ドラッグしたカードが所属するカラム（ドラッグ前にカードが所属していたカラムIDも呼ばれる）のオブジェクト
    const overColumn = findColumn(overId); // ドラッグで重なったカラムのオブジェクト
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
    setColumns((prevState) => { // prevState・・・ドラッグ中に他カラムと重なったときの全カラムの状態をプロパティで取得する
      const activeItems = activeColumn.cards; // activeColumnのcardsというプロパティを取得
      const overItems = overColumn.cards; // overColumnのcardsというプロパティを取得
      const activeIndex = activeItems.findIndex((i) => i.id === activeId);
      const overIndex = overItems.findIndex((i) => i.id === overId);
      const newIndex = () => {
        const putOnBelowLastItem = overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return prevState.map((c) => { // ドラッグ中の並び順の更新
        if (c.id === activeColumn.id) {
          c.cards = activeItems.filter((i) => i.id !== activeId);
          return c;
        } else if (c.id === overColumn.id) {
          c.cards = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length)
          ];
          return c;
        } else {
          return c;
        }
      });
    });
    saveToLocalStorage("task", data, count);
  };
  // ドラッグした後の並び順の更新
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id); // ドロップした時に呼ばれる、ドロップした時のカードID
    const overId = over ? String(over.id) : null; // ドロップした時に重なったカードID
    const activeColumn = findColumn(activeId); // ドロップされたカラムのプロパティ
    const overColumn = findColumn(overId); // ドロップされたカラムのプロパティ

    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }

    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);

    if (activeIndex !== overIndex) {
      setColumns((prevState) => { // 同じステータス内で順番が変わった時に呼ばれてる
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.cards = arrayMove(overColumn.cards, activeIndex, overIndex);
            return column;
          } else {
            return column;
          }
        });
      });
      saveToLocalStorage("task", data, count);
    }
  };

  const sensors = useSensors( // ドラッグ&ドロップに、とりあえず必要なコンポーネントやな
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div
        className="App"
        style={{ display: "flex", flexDirection: "row", padding: "20px" }}
      >
        {columns.map((column) => (
          <React.Fragment key={column.id}>
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
              onAddTask={handleAddTask}
            ></Column>
          </React.Fragment>
        ))}
      </div>
    </DndContext>
  );
}

export default App;