import React from 'react';
import { useLocation } from 'react-router-dom';

const CheckSolution: React.FC = () => {
    const location = useLocation();
    const { imageUrl } = location.state as { imageUrl: string };

    return (
        <div>
            <h1>Проверка решения</h1>
            <img src={imageUrl} alt="Check Solution" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
    );
};

export default CheckSolution;
