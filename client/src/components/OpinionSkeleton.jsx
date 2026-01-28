import React from 'react';

const OpinionSkeleton = () => {
    return (
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333] animate-pulse h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#333]"></div>
                    <div className="flex flex-col gap-2">
                        <div className="h-4 w-24 bg-[#333] rounded"></div>
                        <div className="h-3 w-16 bg-[#333] rounded"></div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="h-6 w-3/4 bg-[#333] rounded"></div>
                <div className="h-4 w-full bg-[#333] rounded"></div>
                <div className="h-4 w-5/6 bg-[#333] rounded"></div>
                <div className="h-4 w-4/6 bg-[#333] rounded"></div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-[#333] mt-auto">
                <div className="h-8 w-16 bg-[#333] rounded-full"></div>
                <div className="h-8 w-16 bg-[#333] rounded-full"></div>
                <div className="h-8 w-8 bg-[#333] rounded-full ml-auto"></div>
            </div>
        </div>
    );
};

export default OpinionSkeleton;
