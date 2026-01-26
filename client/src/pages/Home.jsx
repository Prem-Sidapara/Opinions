import React from 'react';
import EmptyBar from '../components/EmptyBar';
import Feed from '../components/Feed';

const Home = () => {
    return (
        <div className="relative">
            <EmptyBar />
            <Feed />
        </div>
    );
};

export default Home;
