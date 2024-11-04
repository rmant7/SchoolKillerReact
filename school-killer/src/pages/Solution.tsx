import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @ts-ignore
import { performOCR } from '../api.js'; //

const Solution: React.FC = () => {
    const location = useLocation();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [ocrText, setOcrText] = useState<string | null>(null);

    useEffect(() => {
        if (location.state && location.state.imageUrl) {
            setImageUrl(location.state.imageUrl);
        }
    }, [location.state]);

    const handleOcrRequest = async () => {
        const userId = sessionStorage.getItem('user_id');
        if (!userId) {
            console.error("User ID not found in session.");
            return;
        }
        try {
            const data = await performOCR(userId);
            setOcrText(data.extracted_text || 'No text detected.');
        } catch (error) {
            console.error("Error performing OCR:", error);
        }
    };

    return (
        <div>
            <h2>Solution Page</h2>
            {imageUrl && <img src={imageUrl} alt="Selected" />}
            <button onClick={handleOcrRequest}>Perform OCR</button>
            {ocrText && <div><h3>OCR Result:</h3><p>{ocrText}</p></div>}
        </div>
    );
};

export default Solution;
