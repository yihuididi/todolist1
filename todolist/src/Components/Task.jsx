import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

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
        <>
            {/* Container of a task*/}
            <div className="task card mb-2">
                <div className="card-body p-2">
                    <h5 className="card-title">{task.name}</h5>
                    <p className="card-text mb-1">Category: {task.category}</p>
                    <p className="card-text mb-1">Due Date: {task.dueDate}</p>
                    <p className="card-text mb-1">EXP: {task.expReward}XP</p>
                    <div className="form-check mb-1">
                        <input 
                            type="checkbox" 
                            className="form-check-input"
                            checked={task.completed} 
                            onChange={() => onUpdate({ completed: !task.completed })} 
                        />
                        <label className="form-check-label">Completed</label>
                    </div>
                    <Button variant="primary" onClick={() => setEditing(true)} size="sm">Edit</Button>
                    <Button variant="danger" onClick={onDelete} size="sm" className="ms-2">Delete</Button>
                </div>
            </div>

            {/* Bootstrap Modal(popup) for Editing Task */}
            <Modal show={editing} onHide={() => setEditing(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Task Name</label>
                        <input 
                            type="text" 
                            className="form-control form-control-sm"
                            placeholder="Task Name"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label form-control-sm">Category</label>
                        <input 
                            type="text" 
                            className="form-control form-control-sm"
                            placeholder="Category"
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Due Date</label>
                        <input 
                            type="date" 
                            className="form-control form-control-sm"
                            value={dueDate} 
                            onChange={(e) => setDueDate(e.target.value)} 
                        />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">EXP</label>
                        <input 
                            type="number" 
                            className="form-control form-control-sm"
                            placeholder="EXP"
                            value={expReward} 
                            onChange={(e) => setExpReward(e.target.value)} 
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditing(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
        
    );
};

export default Task;
