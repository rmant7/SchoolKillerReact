import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import './index.css'; // Ensure to import your CSS file here
import localization from './localization.json';
import yourImage from './images/image.jpg'; // Import your image here

const App: React.FC = () => {
    // State variables
    const [files, setFiles] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
    const [locale, setLocale] = useState<'en' | 'ru'>('en');
    
    // Dropdown states
    const [selectedClass, setSelectedClass] = useState<string>('1');
    const [solutionLanguage, setSolutionLanguage] = useState<string>('English'); 
    const [sourceLanguage, setSourceLanguage] = useState<string>('English');
    const [explanationType, setExplanationType] = useState<string>('Brief explanation');
    
    // New state for text area
    const [taskDescription, setTaskDescription] = useState<string>('');

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
        <div className="app-container">
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

            {/* New Features Section Start */}
            <div className="upload-section">
                {/* Image Display Above the "Add Task" Label */}
                <div className="image-display">
                    <img
                        src={yourImage} // Use the imported image here
                        alt="Descriptive Alt Text"
                        className="above-upload-image"
                    />
                </div>

                <h2>{localization[locale].addTask}</h2>

                <div className="input-container">
                    {/* Text Area for Task Description */}
                    <textarea
                        className="task-description"
                        placeholder="Insert task description here..."
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />

                    {/* File Input Area */}
                    <input type="file" multiple onChange={handleFileChange} />
                </div>

                {/* Class Dropdown */}
                <div className="dropdown-container">
                    <label htmlFor="class-select">Class:</label>
                    <select id="class-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>

                {/* Solution Language Dropdown */}
                <div className="dropdown-container">
                    <label htmlFor="solution-language-select">Solution language:</label>
                    <select id="solution-language-select" value={solutionLanguage} onChange={(e) => setSolutionLanguage(e.target.value)}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Russian">Russian</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="Italian">Italian</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Hindi">Hindi</option>
                        {/* Add more languages as necessary */}
                    </select>
                </div>

                {/* Source Language Dropdown */}
                <div className="dropdown-container">
                    <label htmlFor="source-language-select">Source language of the task:</label>
                    <select id="source-language-select" value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Russian">Russian</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="Italian">Italian</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Hindi">Hindi</option>
                        {/* Add more languages as necessary */}
                    </select>
                </div>

                {/* Explanations Dropdown */}
                <div className="dropdown-container">
                    <label htmlFor="explanation-select">Explanations:</label>
                    <select id="explanation-select" value={explanationType} onChange={(e) => setExplanationType(e.target.value)}>
                        <option value="Brief explanation">Brief explanation</option>
                        <option value="Additional information">Additional information</option>
                        <option value="Only solve the problem">Only solve the problem</option>
                    </select>
                </div>
                
                {/* Decide Button */}
                <button className="decide-button" onClick={handleSolutionClick} disabled={selectedImageIndex === null}>
                    Decide
                </button>
            </div>
            {/* New Features Section End */}
        </div>
    );
};

export default App;