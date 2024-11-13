import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const ImageUpload = ({ onImageUpload }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                onImageUpload(reader.result);

                const img = new Image();
                img.src = reader.result;
                img.onload = async () => {
                    await tf.setBackend('webgl');
                    const model = await mobilenet.load();
                    const predictions = await model.classify(img);
                    setPredictions(predictions);
                    setIsLoading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="main-container">
            <div className="upload-section">
                <div className="logo">
                    Crop<span style={{ color: '#4CAF50' }}>Wise</span>
                </div>
                
                <div className="upload-box">
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" className="upload-button">
                        {isLoading ? 'Analyzing...' : 'Upload Crop Image'}
                    </label>
                    <p style={{ marginTop: '10px', color: '#666' }}>
                        Upload a photo of your crop to identify pests
                    </p>
                </div>

                {predictions.length > 0 && !isLoading && (
                    <div className="results-container">
                        <h3 style={{ margin: '0 0 10px 0' }}>Analysis Results:</h3>
                        {predictions.map((prediction, index) => (
                            <div key={index} className="result-item">
                                <span>{prediction.className}</span>
                                <span>{(prediction.probability * 100).toFixed(2)}%</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="preview-section">
                {imagePreview ? (
                    <img 
                        src={imagePreview} 
                        alt="Crop preview" 
                        className="preview-image"
                    />
                ) : (
                    <div style={{ 
                        height: '300px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px'
                    }}>
                        Preview will appear here
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;