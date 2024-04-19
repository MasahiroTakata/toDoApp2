import React from 'react';
import {useDroppable} from '@dnd-kit/core'; // hooks

export function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = { // ドロップ可能な要素の上に乗るとtrueになる（だから三項演算子を使用している）
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}