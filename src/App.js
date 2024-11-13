import React, { useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import ImageUpload from './components/ImageUpload';

const App = () => {
    const [model, setModel] = useState(null);

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
                // The predictions are now handled directly in the ImageUpload component
            }
        };
    };

    return (
        <div>
            <ImageUpload onImageUpload={handleImageUpload} />
        </div>
    );
};

export default App;