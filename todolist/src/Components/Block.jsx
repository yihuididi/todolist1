import React, { useState, useEffect } from 'react';
import { getFirestore, collection, doc, getDocs, deleteDoc, setDoc } from 'firebase/firestore';
import Task from './Task.jsx';

const Block = ({ block, updateBlock, deleteBlock }) => {
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskExpReward, setNewTaskExpReward] = useState('');
    const db = getFirestore();

    useEffect(() => {
        const fetchTasks = async () => {
            const tasksSnapshot = await getDocs(collection(db, 'Users', 'userId', 'Pages', 'pageId', 'Blocks', block.id, 'Tasks'));
            setTasks(tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchTasks();
    }, [block.id, db]);

    const addTask = async () => {
        const newTaskRef = doc(collection(db, 'Users', 'userId', 'Pages', 'pageId', 'Blocks', block.id, 'Tasks'));
        const newTask = {
            name: newTaskName,
            category: newTaskCategory,
            creationTime: new Date(),
            dueDate: newTaskDueDate,
            expReward: newTaskExpReward,
            completed: false
        };
        await setDoc(newTaskRef, newTask);
        setTasks([...tasks, { id: newTaskRef.id, ...newTask }]);
        setNewTaskName('');
        setNewTaskCategory('');
        setNewTaskDueDate('');
    };

    const updateTask = async (taskId, updatedTask) => {
        const taskRef = doc(db, 'Users', 'userId', 'Pages', 'pageId', 'Blocks', block.id, 'Tasks', taskId);
        await setDoc(taskRef, updatedTask, { merge: true });
        setTasks(tasks.map(task => task.id === taskId ? { ...task, ...updatedTask } : task));
    };

    const deleteTask = async (taskId) => {
        await deleteDoc(doc(db, 'Users', 'userId', 'Pages', 'pageId', 'Blocks', block.id, 'Tasks', taskId));
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleBlockHeadingChange = (e) => {
        updateBlock(block.id, { heading: e.target.value });
    };

    const handleBlockColorChange = (e) => {
        updateBlock(block.id, { color: e.target.value });
    };

    return (
        <div className="block">
            <input 
                type="text" 
                value={block.heading} 
                onChange={handleBlockHeadingChange} 
                placeholder="Block Heading" 
            />
            <input 
                type="color" 
                value={block.color} 
                onChange={handleBlockColorChange} 
            />
            <button onClick={() => deleteBlock(block.id)}>Delete Block</button>
            <div className="tasks">
                {tasks.map(task => (
                    <Task 
                        key={task.id} 
                        task={task} 
                        onDelete={() => deleteTask(task.id)} 
                        onUpdate={(updatedTask) => updateTask(task.id, updatedTask)} 
                    />
                ))}
                <div className="add-task-form">
                    <input 
                        type="text" 
                        placeholder="Task Name" 
                        value={newTaskName} 
                        onChange={(e) => setNewTaskName(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Category" 
                        value={newTaskCategory} 
                        onChange={(e) => setNewTaskCategory(e.target.value)} 
                    />
                    <input 
                        type="date" 
                        value={newTaskDueDate} 
                        onChange={(e) => setNewTaskDueDate(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        placeholder="EXP" 
                        value={newTaskExpReward} 
                        onChange={(e) => setNewTaskExpReward(e.target.value)} 
                    />
                    <button onClick={addTask} className="btn btn-primary">Add Task</button>
                </div>
            </div>
        </div>
    );
};

export default Block;
