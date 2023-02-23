import React, { useState } from 'react';

export default function Dropzone(props) {
    const [draggedItem, setDraggedItem] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        const files = [...event.dataTransfer.files];
        const fileUrls = files.map((file) => URL.createObjectURL(file));
        props.onDrop(fileUrls);
    };

    const handleDragStart = (event, item) => {
        setDraggedItem(item);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    return (
        <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            style={{ display: 'flex' }}
        >
            {props.items.map((item) => (
                <img
                    key={item}
                    src={item}
                    draggable
                    onDragStart={(event) => handleDragStart(event, item)}
                    onDragEnd={handleDragEnd}
                    style={{
                        opacity: draggedItem === item ? 0.5 : 1,
                        cursor: 'move',
                        marginRight: '10px',
                        width: '100px',
                        height: '100px',
                    }}
                />
            ))}
        </div>
    );
}
