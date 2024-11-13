// main logic for loading the MobileNet model and making predictions

import React, { useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import ImageUpload from './components/ImageUpload';
import PredictionResult from './components/PredictionResult';

const App = () => {
    const [model, setModel] = useState(null);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        // Load MobileNet model on app load
        mobilenet.load().then((loadedModel) => setModel(loadedModel));
    }, []);

    // Handle image uploads and make predictions
    const handleImageUpload = async (image) => {
        const img = new Image();
        img.src = image;

        img.onload = async () => {
            if (model) {
                const predictions = await model.classify(img);
                setPredictions(predictions);  // Store predictions for display
            }
        };
    };

    return (
        <div>
            <ImageUpload onImageUpload={handleImageUpload} />
            {predictions.length > 0 && <PredictionResult predictions={predictions} />}
        </div>
    );
};

export default App;
