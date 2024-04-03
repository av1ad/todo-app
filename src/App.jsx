import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import iconMoon from "./assets/images/icon-moon.svg";
import iconCross from "./assets/images/icon-cross.svg";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

const ItemTypes = {
  TODO: "todo",
};

const Todo = ({ todo, index, toggleTodo, deleteTodo, moveTodo }) => {
  const [, dragRef] = useDrag({
    type: ItemTypes.TODO,
    item: { id: todo.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemTypes.TODO,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveTodo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const ref = React.useRef(null);
  const dragDropRef = dragRef(dropRef(ref));

  return (
    <li ref={dragDropRef} className="todo-item">
      <div className="d-flex align-items-center">
        <input
          type="checkbox"
          className="me-2"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
          {todo.text}
        </span>
      </div>
      <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>
        <img src={iconCross} />
      </button>
    </li>
  );
};

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("light");

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const newId = Date.now().toString();
      setTodos([...todos, { id: newId, text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const clearCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const moveTodo = (dragIndex, hoverIndex) => {
    const updatedTodos = [...todos];
    const [reorderedItem] = updatedTodos.splice(dragIndex, 1);
    updatedTodos.splice(hoverIndex, 0, reorderedItem);
    setTodos(updatedTodos);
  };

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`app ${theme} container`}>
        <div className="">
          <div className="d-flex justify-content-between header">
            <h1 className="text-center my-4">Todo</h1>
            <button className="theme-button" onClick={toggleTheme}>
              <img src={iconMoon} />
            </button>
          </div>
          <div className="d-flex mb-3 filter-list">
            <button className="todo-button btn btn-primary" onClick={addTodo}>
              Add
            </button>
            <input
              type="text"
              className="todo-input form-control me-2"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Create a new todo..."
            />
          </div>
          <div className="todo-list-container container my-5">
            <ul className="todo-list">
              {filteredTodos.map((todo, index) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  index={index}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  moveTodo={moveTodo}
                />
              ))}
            </ul>
            <div className="d-flex justify-content-between align-items-start">
            <p className="items-left">{activeTodosCount} items left</p>
            <button className="clear-button" onClick={clearCompletedTodos}>
              Clear Completed
            </button>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-3 filter-list">
            <button
              className={`filter-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-button ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`filter-button ${
                filter === "completed" ? "active" : ""
              }`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
        <div className="footer">Drag and drop to reorder list</div>
      </div>
    </DndProvider>
  );
}

export default App;
