import React from 'react';

const ComingSoonPage = ({ name }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] pt-20">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-2">Coming Soon</h2>
            <p className="text-gray-400">The {name} {name === "Ask" ? "" : "section"} is currently under development.</p>
        </div>
    );
};

export default ComingSoonPage;
