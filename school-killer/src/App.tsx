import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import localization from './localization.json';

const App: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
    const [locale, setLocale] = useState<'en' | 'ru'>('en');
    const navigate = useNavigate();

    useEffect(() => {
        const deviceLanguage = navigator.language;
        setLocale(deviceLanguage.startsWith('ru') ? 'ru' : 'en');
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        }
    };

    const handleDeleteImage = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        if (selectedImageIndex === index) {
            setSelectedImageIndex(null);
            setZoomedImageIndex(null);
        }
    };

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleZoomToggle = (index: number) => {
        setZoomedImageIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleSolutionClick = () => {
        if (selectedImageIndex !== null) {
            const selectedFile = files[selectedImageIndex];
            const imageUrl = URL.createObjectURL(selectedFile);
            navigate('/solution', { state: { imageUrl } });
        }
    };

    const handleCheckSolutionClick = () => {
        if (selectedImageIndex !== null) {
            const selectedFile = files[selectedImageIndex];
            const imageUrl = URL.createObjectURL(selectedFile);
            navigate('/check-solution', { state: { imageUrl } });
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (zoomedImageIndex !== null) {
            const target = event.target as HTMLElement;
            if (!target.closest('.image-wrapper')) {
                setZoomedImageIndex(null);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [zoomedImageIndex]);

    return (
        <div>
            <Header />
            <div className="image-container">
                {files.map((file, index) => {
                    const isImage = file.type.startsWith('image/');
                    const isSelected = selectedImageIndex === index;
                    const isZoomed = zoomedImageIndex === index;

                    return (
                        <div key={index} className="file-item">
                            {isImage && (
                                <div className="image-wrapper">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Uploaded"
                                        className={`file-image ${isSelected ? 'selected' : ''} ${isZoomed ? 'zoomed' : ''}`}
                                        onClick={() => handleImageClick(index)}
                                    />
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteImage(index)}
                                        aria-label="Delete"
                                    >
                                        &times;
                                    </button>
                                    {!isZoomed && (
                                        <button
                                            className="zoom-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleZoomToggle(index);
                                            }}
                                            aria-label="Zoom"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="upload-section">
                <h2>{localization[locale].addTask}</h2>
                <input type="file" multiple onChange={handleFileChange} />
                <button
                    onClick={handleSolutionClick}
                    disabled={selectedImageIndex === null}
                    style={{ backgroundColor: selectedImageIndex === null ? 'lightgrey' : '#4fc3f7' }}
                >
                    {localization[locale].viewSolution}
                </button>
                <button
                    onClick={handleCheckSolutionClick}
                    disabled={selectedImageIndex === null}
                    style={{ backgroundColor: selectedImageIndex === null ? 'lightgrey' : '#4fc3f7' }}
                >
                    {localization[locale].solve}
                </button>
            </div>
        </div>
    );
};

export default App;
