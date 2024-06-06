import React, { useState } from 'react';

const Task = ({ task, onDelete, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(task.name);
    const [category, setCategory] = useState(task.category);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [expReward, setExpReward] = useState(task.expReward);

    const handleUpdate = () => {
        onUpdate({ name, category, dueDate, expReward, completed: task.completed });
        setEditing(false);
    };

    return (
        <div className="task">
            {editing ? (
                <>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                    />
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        value={expReward} 
                        onChange={(e) => setExpReward(e.target.value)} 
                    />
                    <button onClick={handleUpdate}>Save</button>
                </>
            ) : (
                <>
                    <p>{task.name}</p>
                    <p>{task.category}</p>
                    <p>{task.dueDate}</p>
                    <p>{task.expReward} XP</p>
                    <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => onUpdate({ completed: !task.completed })} 
                    />
                    <button onClick={() => setEditing(true)}>Edit</button>
                    <button onClick={onDelete}>Delete</button>
                </>
            )}
        </div>
    );
};

export default Task;
