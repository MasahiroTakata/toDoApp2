import { FC, useState } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./Card";
import classes from './CssModules.module.scss';
export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
  onAddTask: (columnId: string, taskName: string) => void;
};
// タスクをドロップするスペースの作成
const Column: FC<ColumnType> = ({ id, title, cards, onAddTask}) => {
  const { setNodeRef } = useDroppable({ id: id });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [taskName, setTaskName] = useState('');

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };
  const handleAddTaskClick = () => {
    onAddTask(id, taskName);
    setTaskName(''); // 入力フィールドをクリア
    handleClosePopup();
  };

  return (
    // ソートを行うためのContextです。
    // strategyは4つほど存在しますが、今回は縦・横移動可能なリストを作るためrectSortingStrategyを採用
    <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        style={{
          width: "200px",
          background: "rgba(245,247,249,1.00)",
          marginRight: "10px"
        }}
      >
        <p
          style={{
            padding: "5px 20px",
            textAlign: "left",
            fontWeight: "500",
            color: "#575757"
          }}
        >
          {title}
        </p>
        <button onClick={handleOpenPopup} className={classes.btnOrange}>＋タスクを追加</button>
        {isPopupOpen && (
        <div className={classes.popup}>
          <div className={classes.popupInner}>
            <h2>タスクを追加</h2>
            <h5>{title}</h5>
            <div className={classes.cpIptxt}>
              <label className={classes.ef}>
              <input
                type="text"
                value={taskName}
                onChange={handleTaskNameChange}
                placeholder="タスク名を入力"
              />
              </label>
            </div>
            <button onClick={handleAddTaskClick} className={classes.popupBtn}>追加</button>
            <button onClick={handleClosePopup} className={classes.popupBtn}>キャンセル</button>
          </div>
        </div>
      )}
        {cards.map(card => (
          <Card key={card.id} id={card.id} title={card.title}></Card>
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;