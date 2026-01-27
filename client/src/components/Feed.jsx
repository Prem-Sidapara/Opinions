import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import OpinionCard from './OpinionCard';
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

    useEffect(() => {
        const fetchOpinions = async () => {
            setLoading(true); // Reset loading on params change
            try {
                const params = {};
                if (search) params.search = search;
                if (topic) params.topic = topic;

                const res = await api.get('/opinions', { params });

                if (Array.isArray(res.data)) {
                    setItems(res.data);
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

    if (loading) return <div className="text-white text-center mt-10">Loading opinions...</div>;
    // We might want to show error but also allow retry or show empty state if search yields nothing
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
    if (items.length === 0) return <div className="text-gray-500 text-center mt-10">No opinions found.</div>;

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
                {items.map((item) => (
                    <OpinionCard
                        key={item._id}
                        item={item}
                        onClick={() => handleOpinionClick(item._id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Feed;

