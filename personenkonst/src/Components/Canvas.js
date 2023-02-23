import React, { useRef, useEffect } from "react";

function Canvas(props) {
    const canvasRef = useRef(null);
    const { items, onItemMove, draggedItemId } = props;

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        items.forEach((item) => {
            const image = new Image();
            image.src = item.src;
            image.onload = () => {
                context.drawImage(image, item.x, item.y, item.width, item.height);
            };
        });
    }, [items]);

    const handleMouseDown = (event) => {
        const { offsetX: x, offsetY: y } = event.nativeEvent;
        const item = items.find((item) =>
            x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height
        );
        if (item) {
            const handleMouseMove = (event) => {
                const { movementX, movementY } = event.nativeEvent;
                const newItem = { ...item, x: item.x + movementX, y: item.y + movementY };
                onItemMove(newItem, newItem.x, newItem.y);
            };
            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const { offsetX: x, offsetY: y } = event.nativeEvent;
        const draggedItem = items.find((item) => item.id === draggedItemId);
        if (draggedItem) {
            const newItem = { ...draggedItem, x, y };
            onItemMove(newItem, newItem.x, newItem.y);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className={draggedItemId ? "dragging" : ""}
            onMouseDown={handleMouseDown}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        />
    );
}

export default Canvas;
