import React, { useState } from "react";

const Home = () => {
    const [tasks, setTasks] = useState([]); // Estado de las tareas
    const [inputValue, setInputValue] = useState(""); // Estado para el campo de texto

    // Función para agregar tareas
    const addTask = (event) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            setTasks([...tasks, inputValue.trim()]); // Agregar nueva tarea
            setInputValue(""); // Vaciar el campo
        }
    };

    // Función para eliminar tareas
    const deleteTask = (index) => {
        setTasks(tasks.filter((_, taskIndex) => taskIndex !== index));
    };

    return (
        <div className="todo-container">
            <h1 className="todo-title">TODOS</h1>
            <div className="todo-card">
                <input
                    type="text"
                    className="todo-input"
                    placeholder="Añadir tareas"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addTask}
                />
                <ul className="todo-list">
                    {tasks.length === 0 ? (
                        <li className="todo-item no-tasks">
                            No hay tareas
                        </li>
                    ) : (
                        tasks.map((task, index) => (
                            <li
                                key={index}
                                className="todo-item d-flex justify-content-between align-items-center"
                            >
                                {task}
                                <span
                                    className="todo-delete"
                                    onClick={() => deleteTask(index)}
                                >
                                    ✖
                                </span>
                            </li>
                        ))
                    )}
                </ul>
                <div className="todo-footer">
                    {tasks.length} item{tasks.length > 1 ? "s" : ""} restantes
                </div>
            </div>
        </div>
    );
};

export default Home;