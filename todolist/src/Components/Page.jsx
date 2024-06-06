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
            <div className="add-block-form">
                <input 
                    type="text" 
                    placeholder="Block Heading" 
                    value={newBlockHeading} 
                    onChange={(e) => setNewBlockHeading(e.target.value)} 
                />
                <input 
                    type="color" 
                    value={newBlockColor} 
                    onChange={(e) => setNewBlockColor(e.target.value)} 
                />
                <button onClick={handleAddBlock} className="btn btn-primary">Add Block</button>
            </div>
            <div className="blocks-container">
                {blocks.map((block) => (
                    <div key={block.id} style={{ backgroundColor: block.color }}>
                        <Block block={block} updateBlock={updateBlock} deleteBlock={deleteBlock} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;

