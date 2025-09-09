import { useRef, useEffect, useState, useMemo, useId } from 'react';
import './CurvedLoop.css';

const CurvedLoop = ({
  children,
  speed = 2,
  className = '',
  curveAmount = 400,
  direction = 'left',
  interactive = true
}) => {
  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const pathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  const ready = spacing > 0;

  // Create repeated content for seamless loop
  const repeatedContent = useMemo(() => {
    if (!ready) return children;
    const repeatCount = Math.ceil(1800 / Math.max(textLength, 200)) + 2;
    return Array(repeatCount).fill(children);
  }, [children, ready, textLength]);

  useEffect(() => {
    if (measureRef.current) {
      const bbox = measureRef.current.getBBox();
      setSpacing(bbox.width || 200);
    }
  }, [children, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;

        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;

        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = e => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.target.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = e => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;

    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;

    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;

    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120">
        <g ref={measureRef} style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {children}
        </g>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <g className={className}>
            <foreignObject width="100%" height="100%">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="100%" height="100%">
                  <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'}>
                    <foreignObject width="2000" height="60">
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        height: '60px',
                        whiteSpace: 'nowrap'
                      }}>
                        {repeatedContent.map((content, idx) => (
                          <div key={idx} className="icon-wrapper">
                            {content}
                          </div>
                        ))}
                      </div>
                    </foreignObject>
                  </textPath>
                </svg>
              </div>
            </foreignObject>
          </g>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
