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
            // Subtract passing to avoid scrollbars
            const availableWidth = parentWidth - 48; // increased padding slightly

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

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                overflow: 'auto', // Allow scrolling if zoomed in
                paddingTop: '20px'
            }}
        >
            <div
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${finalScale})`,
                    transformOrigin: 'top center',
                    flexShrink: 0,
                    marginBottom: `${height * (finalScale - 1) + 100}px` // Add margin to scroll to bottom if needed
                }}
            >
                {children}
            </div>
        </div>
    );
};
