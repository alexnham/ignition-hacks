// src/Whiteboard.js
import React, { useRef, useState, useEffect } from 'react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
    const [image, setImage] = useState(null)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    context.closePath();
    setDrawing(false);
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    setImage(dataURL);
  };

  return (
    <div>
              <button className='w-96 flex' onClick={takeScreenshot}>
        Take Screenshot
      </button>
    <div className='flex'>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        width="800"
        height="600"
        style={{ border: '1px solid black', cursor: 'crosshair' }}
      />
      <img width="800" height="600" src={image}></img>
      </div>
    </div>
  );
};

export default Whiteboard;
