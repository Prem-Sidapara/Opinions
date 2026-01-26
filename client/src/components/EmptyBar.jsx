import React from 'react';

const EmptyBar = () => {
    return (
        <div
            className="sticky h-[40px] z-40 bg-[#111] mb-6 w-full"
            style={{
                backgroundImage: 'radial-gradient(circle, #3a3a3aff 1px, transparent 1px)',
                backgroundSize: '10px 10px',
            }}
        >
            {/* Empty bar for future use */}
        </div>
    );
};

export default EmptyBar;
