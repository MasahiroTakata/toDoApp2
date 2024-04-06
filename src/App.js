import classes from './CssModules.module.scss';
import './App.css';
import { useState } from 'react';
import { ChakraProvider, Input, Button, Text, Flex, extendTheme } from "@chakra-ui/react";
// import { useDroppable } from "@dnd-kit/core";

const theme = extendTheme({
  colors: {
    letterColor: {
      100: '#808080',
    },
  },
});

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
    const text = e.currentTarget.getAttribute('data-value');
    setList(
      todoArr.filter(item => item !== text)
    ); // 標準関数っぽいsetListで、配列の中身を更新する
    setText(""); // テキストボックスを空にする
  };

  const todoList = todoArr.map((todoValue) => // map関数
    <div className={classes.taskSpace}>
    <li className={classes.todoList}><p className={classes.pTodo}>{todoValue} </p></li>
    </div>
  );

  return (
    <ChakraProvider theme={theme}>
        <div className={classes.container}>
        <Flex width="400px" align={"center"} bg="" mt="10px">
          <Input type="text" value={todo} placeholder="今日やること" onChange={handleNameChange} className={classes.todoText} />
          <Button onClick={listUp} className={classes.submitBtn}>追加</Button>
        </Flex>
        </div>
        <div className={classes.allTaskSpace}>{/* 未着手、着手中、完了で使用するスペース */}
          <div className={classes.toTaskSpace}>{/* 未着手のスペース */}
            <div className={classes.notTouch}>
              <strong className={classes.notTouchLetter}>予定</strong>
            </div>
            <div class="noTouch">
            <ul>
              <Text lineHeight={"1.3rem"} ml="8px" w="100%" fontSize={"20px"}>
                {todoList}
              </Text>
            </ul>
            </div>
          </div>
          <div className={classes.toTaskSpace}>{/* 着手中のスペース */}
            <div className={classes.notTouch}>
              <strong className={classes.notTouchLetter}>着手中</strong>
            </div>
            <div class="noTouch">
            </div>
          </div>
          <div className={classes.toTaskSpace}>{/* 完了のスペース */}
            <div className={classes.notTouch}>
              <strong className={classes.notTouchLetter}>完了</strong>
            </div>
            <div class="noTouch">
            </div>
          </div>
        </div>
    </ChakraProvider>
  );
}

export default App;