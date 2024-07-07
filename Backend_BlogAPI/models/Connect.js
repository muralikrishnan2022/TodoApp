import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import "./App.css";

import Home from "./pages/Home";
import EditTask from "./pages/EditTask";
import Navbar from "./components/Navbar";

function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/tasks")
            .then((response) => setTasks(response.data))
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    const addTask = (task) => {
        axios
            .post("http://localhost:3000/tasks", task)
            .then((response) => setTasks([...tasks, response.data]))
            .catch((error) => console.error("Error adding task:", error));
    };

    const deleteTask = (id) => {
        axios
            .delete(`http://localhost:3000/tasks/${id}`)
            .then(() => setTasks(tasks.filter((task) => task._id !== id)))
            .catch((error) => console.error("Error deleting task:", error));
    };

    const updateTask = (updatedTask) => {
        axios
            .put(`http://localhost:3000/tasks/${updatedTask._id}`, updatedTask)
            .then((response) =>
                setTasks(
                    tasks.map((task) =>
                        task._id === updatedTask._id ? response.data : task
                    )
                )
            )
            .catch((error) => console.error("Error updating task:", error));
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            editTask={updateTask}
                            addTask={addTask}
                            deleteTask={deleteTask}
                            tasks={tasks}
                        />
                    }
                />
                <Route
                    path="/edit/:id"
                    element={<EditTask updateTask={updateTask} tasks={tasks} />}
                />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App;