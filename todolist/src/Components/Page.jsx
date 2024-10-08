import { useState, useEffect, useRef, forwardRef } from 'react';
import Block from './Block.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Page = forwardRef(({ blocks, addBlock, updateBlock, deleteBlock, onDragEnd, onTaskCompleted }, ref) => {
    const [newBlockHeading, setNewBlockHeading] = useState('');
    const [newBlockColor, setNewBlockColor] = useState('#FFFFFF');

    const addBlockFormRef = useRef();

    const handleAddBlock = () => {
        addBlock(newBlockHeading, newBlockColor);
        setNewBlockHeading('');
        setNewBlockColor('#FFFFFF');
    };

    useEffect(() => {
        addBlockFormRef.current.classList.remove('active');
        setNewBlockHeading('');
        setNewBlockColor('#FFFFFF');
    }, [blocks]);

    return (
        <div ref={ref} className="page-content">
            {/* div to add block */}
            <div 
                ref={addBlockFormRef}
                className="add-block-form ps-5 pe-5 mb-3 d-flex align-items-center" 
                style={{ backgroundColor: newBlockColor}}
            >
                <input 
                    className="form-control me-2"
                    type="text" 
                    placeholder="Block Heading" 
                    value={newBlockHeading} 
                    onChange={(e) => setNewBlockHeading(e.target.value)} 
                />
                <input 
                    className="form-control form-control-color me-4"
                    type="color" 
                    value={newBlockColor} 
                    onChange={(e) => setNewBlockColor(e.target.value)} 
                />
                <button onClick={handleAddBlock} className="btn btn-primary btn-sm ms-4 ">
                    <i className="bi bi-clipboard-plus me-1" style={{ fontSize: '1rem' }}></i>
                    <span style={{ fontWeight: 'bold' }}>Add Block</span>
                </button>
            </div>
            {/* Container of blocks */}
            <div className="container">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='droppable' direction="horizontal">
                        {(provided) => {
                            return (
                                <div className="blocks-container" {...provided.droppableProps} ref={provided.innerRef}>
                                    {blocks.map((block, index) => (
                                        <Draggable key={block.id} draggableId={block.id} index={index}>
                                            {(provided) => (
                                                <div
                                                className="block-item"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                >
                                                    <div
                                                        className="card"
                                                        style={{ border: `5px solid ${block.color}`, borderRadius: '0.25rem' }}
                                                    >
                                                        <Block 
                                                            block={block} 
                                                            updateBlock={updateBlock} 
                                                            deleteBlock={deleteBlock} 
                                                            onTaskCompleted={onTaskCompleted} 
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )
                        }}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
});

export default Page;

