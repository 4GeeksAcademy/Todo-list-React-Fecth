import React, { useState, useEffect } from "react";

const Home = () => {
    const [tasks, setTasks] = useState([]); // Estado de las tareas
    const [inputValue, setInputValue] = useState(""); // Estado para el campo de texto
    const username = "DiegoSB"; 
    const apiUrlTodos = `https://playground.4geeks.com/todo/todos/${username}`; // URL para tareas
    const apiUrlUsers = `https://playground.4geeks.com/todo/users/${username}`; // URL para usuarios

    // Función para sincronizar tareas con el servidor
    const syncTasksWithServer = (todos) => {
        fetch(apiUrlTodos, {
            method: "PUT", // Usamos PUT para actualizar la lista completa de tareas
            body: JSON.stringify({ todos }), // Enviamos las tareas dentro de un objeto todos
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                if (!resp.ok) throw new Error(`Error: ${resp.status}`);
                return resp.json();
            })
            .then(data => console.log("Sincronización exitosa:", data))
            .catch(error => console.error("Error al sincronizar:", error));
    };

    // Función para crear un nuevo usuario si no existe
    const createUser = () => {
        fetch(apiUrlUsers, {
            method: "POST", // Crear un usuario con POST
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: username, todos: [] })
        })
            .then(resp => {
                if (!resp.ok) throw new Error(`Error: ${resp.status}`);
                return resp.json();
            })
            .then(data => {
                console.log("Usuario creado:", data);
                setTasks([]); // Iniciar la lista de tareas vacía
            })
            .catch(error => console.error("Error al crear usuario:", error));
    };

    // Función para cargar tareas iniciales desde el servidor
    const fetchTasks = () => {
        fetch(apiUrlUsers, {
            method: "GET", // Usamos GET para obtener la información del usuario
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                if (resp.status === 404) {
                    console.log("Usuario no encontrado. Creando usuario...");
                    createUser(); // Crear usuario si no existe
                    return [];
                }
                if (!resp.ok) throw new Error(`Error: ${resp.status}`);
                return resp.json();
            })
            .then(data => {
                if (Array.isArray(data.todos)) {
                    console.log("Tareas cargadas desde el servidor:", data.todos);
                    setTasks(data.todos); // Actualizar tareas
                } else {
                    console.error("Formato inesperado recibido:", data);
                    setTasks([]); // Si los datos no son válidos, limpiar las tareas
                }
            })
            .catch(error => console.error("Error al cargar tareas:", error));
    };

    // Cargar tareas iniciales
    useEffect(() => {
        fetchTasks(); // Llamar a la función para cargar las tareas desde la API
    }, []);

    // Función para agregar tareas
    const addTask = (event) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            const newTask = { label: inputValue.trim(), is_done: false };

            // Usamos POST para agregar una nueva tarea
            fetch(apiUrlTodos, {
                method: "POST", // Método POST para agregar una nueva tarea
                body: JSON.stringify(newTask), // El cuerpo es solo la nueva tarea
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => {
                    if (!resp.ok) throw new Error(`Error: ${resp.status}`);
                    return resp.json();
                })
                .then(data => {
                    console.log("Tarea agregada con éxito:", data);
                    // Volver a obtener la lista completa de tareas
                    fetchTasks();
                })
                .catch(error => console.error("Error al agregar tarea:", error));

            setInputValue(""); // Limpiar el campo de entrada
        }
    };

    // Función para eliminar una tarea individualmente
    const deleteTask = (taskId) => {
        // Enviar solicitud de eliminación al servidor usando el ID de la tarea
        fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
            method: "DELETE", // Eliminar la tarea específica
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                if (!resp.ok) throw new Error(`Error: ${resp.status}`);
                console.log("Tarea eliminada con éxito");
                // Sincronizamos el estado después de eliminar la tarea
                fetchTasks(); // Volver a obtener la lista de tareas desde el servidor
            })
            .catch(error => console.error("Error al eliminar tarea:", error));
    };

    // Función para eliminar todas las tareas
    const clearAllTasks = () => {
        // Eliminar todas las tareas individualmente
        Promise.all(
            tasks.map(task => 
                fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            )
        )
            .then(() => {
                console.log("Todas las tareas fueron eliminadas.");
                setTasks([]); // Limpiar el estado local
                fetchTasks(); // Volver a obtener la lista de tareas desde el servidor
            })
            .catch(error => console.error("Error al eliminar todas las tareas:", error));
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
                        <li className="todo-item no-tasks">No hay tareas</li>
                    ) : (
                        tasks.map((task, index) => (
                            <li
                                key={task.id} // Usamos el ID
                                className="todo-item d-flex justify-content-between align-items-center"
                            >
                                {task.label}
                                <span
                                    className="todo-delete"
                                    onClick={() => deleteTask(task.id)} // Pasamos el ID de la tarea para eliminarla
                                >
                                    ✖
                                </span>
                            </li>
                        ))
                    )}
                </ul>
                <div className="todo-footer d-flex justify-content-between">
                    <span>{tasks.length} item{tasks.length !== 1 ? "s" : ""} restantes</span>
                    <button className="btn btn-danger clear-btn" onClick={clearAllTasks}>
                        Eliminar Tareas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
