import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import OpinionCard from './OpinionCard';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOpinions = async () => {
            try {
                const res = await api.get('/opinions');
                setItems(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching opinions:", err);
                setError("Failed to load opinions");
                setLoading(false);
            }
        };

        fetchOpinions();
    }, []);

    const handleOpinionClick = (id) => {
        navigate(`/opinion/${id}`);
    };

    if (loading) return <div className="text-white text-center mt-10">Loading opinions...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <div className="flex-1" style={{ padding: '2.5rem 0' }}>
            <div className="flex items-center justify-between mb-6">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Trending Opinions</h1>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem'
            }}>
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

