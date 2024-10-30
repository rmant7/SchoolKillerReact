import React from 'react';
import { useLocation } from 'react-router-dom';

const Solution: React.FC = () => {
    const location = useLocation();
    const { imageUrl } = location.state as { imageUrl: string };

    return (
        <div>
            <h1>Решение</h1>
            <img src={imageUrl} alt="Solution" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
    );
};

export default Solution;