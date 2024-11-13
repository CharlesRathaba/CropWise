import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import PredictionResult from './PredictionResult';

const ImageUpload = ({ onImageUpload }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [predictions, setPredictions] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Preview the image in the UI
                onImageUpload(reader.result); // Pass image to parent component

                // Load MobileNet model and make predictions
                const img = new Image();
                img.src = reader.result;
                img.onload = async () => {
                    await tf.setBackend('webgl'); // Set the backend to WebGL
                    const model = await mobilenet.load(); // Load the MobileNet model
                    const predictions = await model.classify(img); 
                    console.log(predictions);
                    setPredictions(predictions); // Store predictions for display
                }
            };
            reader.readAsDataURL(file); // Convert the image file to a data URL
        }
    };

    return (
        <div className="container">
            <h1>Pest Detection</h1>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {imagePreview && <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%', marginTop: 10 }} />}
            {predictions.length > 0 && <PredictionResult predictions={predictions} />}
        </div>
    );
};

export default ImageUpload;
