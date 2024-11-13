import React from 'react';

const PredictionResult = ({ predictions }) => {
    return (
        <div className="container">
            <h2>Prediction Results:</h2>
            <ul>
                {predictions.map((prediction, index) => (
                    <li key={index}>
                        {prediction.className}: {(prediction.probability * 100).toFixed(2)}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PredictionResult;
