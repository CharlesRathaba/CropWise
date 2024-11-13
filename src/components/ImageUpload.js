import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload }) => {
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Preview the image in the UI
                onImageUpload(reader.result); // Pass image to parent component
            };
            reader.readAsDataURL(file); // Convert the image file to a data URL
        }
    };

    return (
        <div className="container">
            <h1>Pest Detection</h1>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {imagePreview && <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%', marginTop: 10 }} />}
        </div>
    );
};

export default ImageUpload;
