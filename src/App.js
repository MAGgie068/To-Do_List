import React, { useState } from 'react';
import './App.css';
import _ from 'lodash';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 } from 'uuid';

// const item1 = {
//   id: v4(),
//   name: ''
// }

// const item2 = {
//   id: v4(),
//   name: ''
// }

// const item3 = {
//   id: v4(),
//   name: ''
// }


function App() {

  function refreshPage() {
    window.location.reload(false);
  }

  const [text, setText] = useState("")

  const [state, setState] = useState({
    "todo": {
      title: "Ball",
      items: []
    },
    "in-progress": {
      title: "Striker",
      items: []
    },
    "done": {
      title: "Goal",
      items: []
    }
  })

  const handleDragEnd = ({destination, source}) => {
    if(!destination){
      return
    }
    if(destination.index === source.index && destination.droppableId === source.droppableId){
      return
    }

    const itemCopy = {...state[source.droppableId].items[source.index]}
    setState( prev => {
      prev = {...prev}
      prev[source.droppableId].items.splice(source.index, 1)

      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: "Ball",
          items: [
            {
              id: v4(),
              name: text
            }, ...prev.todo.items]
        }
      }
    })

    setText("")
    
  }

  return (
    <div>
      <div className="head">
        <h1>Task Flow</h1>
      </div>
      <div className="ip">
        <button onClick={refreshPage}>Reset</button>
        <input type="text" value={text} placeholder="Tasks" onChange={(e) => setText(e.target.value)}/>
        <button onClick={addItem}>Add</button>
      </div>
      <div className="App">
        
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return(
              <div key={key} className={"column"}>
                <h3>{data.title}</h3>
                <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return(
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"droppable-col"}>
                        {data.items.map((el, index) => {
                          return(
                            <Draggable key={el.id} index={index} draggableId={el.id}>
                              {(provided, snapshot) => {
                                console.log(snapshot);
                                return(
                                  <div
                                    className={"item"}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                      {el.name}
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
