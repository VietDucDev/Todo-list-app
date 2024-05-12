import React, { Component } from "react";
import "./todoList.css";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface State {
  tasks: Task[];
  newTaskName: string;
  filter: "all" | "todo" | "done";
}

class TodoList extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    const storedTasks = localStorage.getItem("tasks");
    this.state = {
      tasks: storedTasks ? JSON.parse(storedTasks) : [],
      newTaskName: "",
      filter: "all",
    };
  }

  componentDidUpdate() {
    localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTaskName: event.target.value });
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      this.addTask();
    }
  };

  addTask = () => {
    const { newTaskName, tasks } = this.state;
    if (newTaskName.trim() !== "") {
      const newTask: Task = {
        id: tasks.length + 1,
        name: newTaskName,
        completed: false,
      };
      this.setState({
        tasks: [...tasks, newTask],
        newTaskName: "",
      });
    }
  };

  toggleTask = (taskId: number) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  deleteTask = (taskId: number) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((task) => task.id !== taskId),
    }));
  };

  changeFilter = (filter: "all" | "todo" | "done") => {
    this.setState({ filter });
  };

  render() {
    const { tasks, newTaskName, filter } = this.state;

    const filteredTasks =
      filter === "all"
        ? tasks
        : filter === "todo"
        ? tasks.filter((task) => !task.completed)
        : tasks.filter((task) => task.completed);

    return (
      <>
        <div className="main-content">
          <p className="content-1">Let's add what you have to do!</p>
          <p className="content-2">
            Fill the input and click button or "Enter" to add a new task into
            the list.
            <br />
            To mark as completed, just click directly to the task
          </p>
        </div>
        <div className="input-container">
          <input
            className="input"
            type="text"
            value={newTaskName}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
          <button className="add-btn" onClick={this.addTask}>
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        <div className="task-list-container">
          <div className="filter-container">
            <p>List:</p>
            <div className="filter">
              <select
                value={filter}
                onChange={(e) =>
                  this.changeFilter(e.target.value as "all" | "todo" | "done")
                }
              >
                <option value="all">All</option>
                <option value="todo">To do</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <ul className="list-container">
            {filteredTasks.map((task, index) => (
              <li
                className="task-item"
                key={task.id}
                onClick={() => this.toggleTask(task.id)}
                style={{
                  color: task.completed ? "#9CA3AF" : "#000",
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {index + 1}. {task.name}
                <div
                  className="del-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.deleteTask(task.id);
                  }}
                >
                  <i className="fa-solid fa-trash del-icon"></i>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

export default TodoList;
