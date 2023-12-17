import classes from './CssModules.module.scss';
import './App.css';
import { useState } from 'react';

function App() {
  const [todo, setText] = useState(""); // テキストボックスの更新関数
  const [todoArr, setList] = useState([]); // やる事リストの更新関数

  const handleNameChange = (event) => {
    setText(event.target.value);
  };

  const listUp = () => {
    const newList = [...todoArr, todo]; // スプレッド構文
    setList(newList); // 標準関数っぽいsetListで、配列の中身を更新する
    setText(""); // テキストボックスを空にする
  };

  const todoDelete = (e) => {
    const text = e.currentTarget.getAttribute('data-num');
    setList(
      todoArr.filter(item => item !== text)
    ); // 標準関数っぽいsetListで、配列の中身を更新する
    setText(""); // テキストボックスを空にする
  };

  const todoList = todoArr.map((todoValue) => // map関数
    <li className={classes.todoList}><p className={classes.pTodo}>{todoValue} </p><button onClick={todoDelete} className={classes.submitBtn} data-num={todoValue}>削除</button></li>
  );

  return (
    <div>
        <div className={classes.container}>
        <input type="text" value={todo} placeholder="今日やること" onChange={handleNameChange} className={classes.todoText} />
        <button onClick={listUp} className={classes.submitBtn}>追加</button>
        </div>
        <p>やる事</p>
        <ul>
        {todoList}
        </ul>
    </div>
  );
}

export default App;