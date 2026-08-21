// client/src/components/DrawingCanvas.jsx
import { useRef, useState, useEffect } from 'react';
import { Trash2, Send } from 'lucide-react';

export default function DrawingCanvas({ onSubmit }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Set canvas dimensions to fit mobile screens nicely
    canvas.width = canvas.offsetWidth;
    canvas.height = 300; 
    
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#00F0FF'; // XENO Cyan
    context.lineWidth = 4;
    
    // Fill with a dark background so it matches the app
    context.fillStyle = '#1A1A24';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    setCtx(context);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (ctx) ctx.beginPath(); // Reset path so lines don't connect automatically
  };

  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    
    // Support both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.nativeEvent.offsetX;
    const clientY = e.touches ? e.touches[0].clientY : e.nativeEvent.offsetY;
    
    // Adjust for canvas bounds
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.touches ? clientX - rect.left : clientX;
    const y = e.touches ? clientY - rect.top : clientY;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.fillStyle = '#1A1A24';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.beginPath();
    }
  };

  const handleSubmit = () => {
    // Convert the canvas to a base64 image string
    const base64Image = canvasRef.current.toDataURL('image/png');
    onSubmit(base64Image);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '16px',
          border: '2px solid var(--accent-cyan)',
          touchAction: 'none' // Prevents the screen from scrolling while drawing
        }}
      />
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={clearCanvas}
          style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--accent-pink)', color: 'var(--accent-pink)', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Trash2 size={18} /> Clear
        </button>
        <button 
          onClick={handleSubmit}
          style={{ flex: 2, padding: '14px', borderRadius: '12px', background: 'var(--accent-cyan)', border: 'none', color: 'var(--bg-base)', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <Send size={18} /> Submit Art
        </button>
      </div>
    </div>
  );
}
