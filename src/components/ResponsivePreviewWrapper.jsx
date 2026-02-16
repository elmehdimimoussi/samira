import { useRef, useState, useEffect } from 'react';

/**
 * A wrapper component that automatically scales its content to fit the parent container.
 * Useful for the Preview image which has fixed pixel dimensions but must look responsive.
 */
export const ResponsivePreviewWrapper = ({ children, width, height, onScaleChange }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (!containerRef.current || !width || !height) return;

        const updateScale = () => {
            const container = containerRef.current;
            if (!container) return;

            const availableWidth = Math.max(0, container.clientWidth - 24);
            const availableHeight = Math.max(0, container.clientHeight - 24);

            const widthScale = availableWidth / width;
            const heightScale = availableHeight / height;
            const nextScale = Math.max(0.1, Math.min(widthScale, heightScale));
            setScale(nextScale);
            onScaleChange?.(nextScale);
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateScale);
        });

        resizeObserver.observe(containerRef.current);
        updateScale();

        return () => resizeObserver.disconnect();
    }, [width, height, onScaleChange]);
    
    // Calculate the actual visual size after scaling
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const content = typeof children === 'function' ? children({ scale }) : children;

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-auto no-scrollbar"
            style={{ paddingTop: '12px', paddingBottom: '12px' }}
        >
            <div
                style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    position: 'relative',
                    flexShrink: 0  // Prevent flexbox from squishing it
                }}
            >
                <div
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                >
                    {content}
                </div>
            </div>
        </div>
    );
};
