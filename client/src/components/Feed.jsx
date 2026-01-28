import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import OpinionCard from './OpinionCard';
import OpinionSkeleton from './OpinionSkeleton';
import api from '../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Feed = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const search = searchParams.get('search');
    const topic = searchParams.get('topic');
    const viewMode = searchParams.get('view') || 'blog'; // Default to blog/list

    // Track locally added items to prevent overwrite by slow fetches
    const localItemsRef = React.useRef([]);

    useEffect(() => {
        const handleNewOpinion = (e) => {
            const newOpinion = e.detail;
            const enhancedOpinion = { ...newOpinion, isLocal: true }; // Mark as local for debug/handling if needed
            localItemsRef.current = [enhancedOpinion, ...localItemsRef.current];
            setItems(prev => [enhancedOpinion, ...prev]);
        };

        window.addEventListener('opinion-created', handleNewOpinion);
        return () => window.removeEventListener('opinion-created', handleNewOpinion);
    }, []);

    useEffect(() => {
        const fetchOpinions = async () => {
            setLoading(true); // Reset loading on params change
            try {
                const params = {};
                if (search) params.search = search;
                if (topic) params.topic = topic;

                const res = await api.get('/opinions', { params });

                if (Array.isArray(res.data)) {
                    // Merge strategy: Server items + Local items that are NOT in server items (by id)
                    // Actually, simpler: If we have local items, we want to keep them at the top until we refresh/reload or they come from server.
                    // But if fetch finishes AFTER local add, we want to ensure we don't lose the local add.

                    const serverItems = res.data;
                    const localItems = localItemsRef.current;

                    // Filter out any local items that are now present in server response (to avoid duplication if re-fetching)
                    const serverIds = new Set(serverItems.map(i => i._id));
                    const uniqueLocalItems = localItems.filter(i => !serverIds.has(i._id));

                    // Combine: Local (newest) + Server
                    // Note: This assumes local items are always newer than what server just sent.
                    setItems([...uniqueLocalItems, ...serverItems]);

                    // Update ref to only keep truly unique local ones ensuring we don't hold them forever if they are on server
                    // Actually, once they are on server, we can clear them from "local unique" tracking?
                    // Safe bet: keep them until component unmount or next hard refresh
                } else {
                    console.error("Unexpected API response format:", res.data);
                    setError("Received invalid data from server.");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching opinions:", err);
                setError("Failed to load opinions");
                setLoading(false);
            }
        };

        fetchOpinions();
    }, [search, topic]); // Re-fetch when URL params change

    const handleOpinionClick = (id) => {
        navigate(`/opinion/${id}`);
    };

    // We might want to show error but also allow retry or show empty state if search yields nothing
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    // Grid View (YouTube Style)
    if (viewMode === 'youtube') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold text-[#FF6B35] mb-2">Coming Soon</h2>
                <p className="text-gray-400">The Youtube Layout is currently under development.</p>
            </div>
        );
    }

    // Blog View (List Style) - Default
    return (
        <div className="container flex-1 w-full" style={{ paddingBottom: '2.5rem' }}>
            <div className="flex items-center justify-between mb-6">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {topic ? `${topic} Opinions` : (search ? `Search results for "${search}"` : 'Trending Opinions')}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    // Show 4 skeletons while loading
                    [...Array(4)].map((_, i) => <OpinionSkeleton key={i} />)
                ) : items.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500 text-lg">No opinions found.</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <OpinionCard
                            key={item._id}
                            item={item}
                            onClick={() => handleOpinionClick(item._id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;

