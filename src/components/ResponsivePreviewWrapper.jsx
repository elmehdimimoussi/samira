import { useRef, useState, useEffect } from 'react';

/**
 * A wrapper component that automatically scales its content to fit the parent container.
 * Useful for the Preview image which has fixed pixel dimensions but must look responsive.
 */
export const ResponsivePreviewWrapper = ({ children, width, height, zoomMultiplier = 1 }) => {
    const containerRef = useRef(null);
    const [baseScale, setBaseScale] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateScale = () => {
            const container = containerRef.current;
            if (!container) return;

            const parentWidth = container.clientWidth;
            // Subtract a small padding to avoid scrollbars
            const availableWidth = parentWidth - 16;

            const newScale = availableWidth / width;
            setBaseScale(newScale);
        };

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateScale);
        });

        resizeObserver.observe(containerRef.current);
        updateScale();

        return () => resizeObserver.disconnect();
    }, [width, height]);

    // Apply manual zoom multiplier to the base "fit-width" scale
    const finalScale = baseScale * zoomMultiplier;
    
    // Calculate the actual visual size after scaling
    const scaledWidth = width * finalScale;
    const scaledHeight = height * finalScale;

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-start justify-center overflow-auto no-scrollbar"
            style={{ paddingTop: '20px', paddingBottom: '20px' }}
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
                        transform: `scale(${finalScale})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
