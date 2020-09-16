import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './dnd_style.css';

function Item({ item, index, stars }) {

  const counting_stars = () => {
    let arr = [];
    for (let i = 0; i < (-1) * index + stars; i++)
      arr.push(<p className='rating_star'>&#9733;</p>);

    return arr;
  }

  return (
    <Draggable
      draggableId={item.name}
      index={index}
    >
      {provided => (
        <div
          className={'sub_block ' + item.style}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <pre className={'category_title'}>{item.name}</pre>
          <br />
          <div>
            {counting_stars()}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Item;
