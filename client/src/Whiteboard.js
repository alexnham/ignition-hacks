import React, { useRef, useState, useEffect } from 'react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (event) => {
    const { offsetX, offsetY } = getEventPosition(event);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing) return;
    const { offsetX, offsetY } = getEventPosition(event);
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
    setImage(dataURL);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setImage(null);
  };

  const getEventPosition = (event) => {
    if (event.nativeEvent.touches && event.nativeEvent.touches[0]) {
      const touch = event.nativeEvent.touches[0];
      const { left, top } = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: touch.clientX - left,
        offsetY: touch.clientY - top,
      };
    } else {
      return {
        offsetX: event.nativeEvent.offsetX,
        offsetY: event.nativeEvent.offsetY,
      };
    }
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        height: '100vh',
        touchAction: 'none',
        position: 'fixed',
        width: '100%',
      }}
    >
      <button className='w-96 flex' onClick={takeScreenshot}>
        Take Screenshot
      </button>
      <button className='clear' onClick={clear}>
        Clear
      </button>
      <div className='flex'>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          width="600"
          height="800"
          style={{ border: '1px solid black', cursor: 'crosshair' }}
        />
        {image && (
          <img width="800" height="600" src={image} alt="Screenshot" />
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
