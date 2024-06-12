import React, { useState } from 'react';
import Block from './Block.jsx';

const Page = ({ blocks, addBlock, updateBlock, deleteBlock }) => {
    const [newBlockHeading, setNewBlockHeading] = useState('');
    const [newBlockColor, setNewBlockColor] = useState('#FFFFFF');

    const handleAddBlock = () => {
        addBlock(newBlockHeading, newBlockColor);
        setNewBlockHeading('');
        setNewBlockColor('#FFFFFF');
    };

    return (
        <div className="page-content">
            {/* div to add block */}
            <div 
                className="add-block-form ps-5 pe-5 pt-4 pb-4 mb-3 d-flex align-items-center" 
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
            <div className="blocks-container">
                {blocks.map((block) => (
                    <div className="card m-3" key={block.id} style={{border: `5px solid ${block.color}`, borderRadius: '0.25rem'}}>
                        <Block block={block} updateBlock={updateBlock} deleteBlock={deleteBlock} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;

