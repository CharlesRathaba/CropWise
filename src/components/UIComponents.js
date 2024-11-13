import React from 'react';

const Logo = () => (
  <div className="text-4xl font-bold text-green-700 mb-8">
    <span>Crop</span>
    <span className="text-green-500">Wise</span>
  </div>
);

const UploadButton = ({ onChange }) => (
  <div className="mb-8">
    <input
      type="file"
      id="file-upload"
      className="hidden"
      onChange={onChange}
      accept="image/*"
    />
    <label
      htmlFor="file-upload"
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Upload Crop Image
    </label>
  </div>
);

const ImagePreview = ({ src }) => (
  <div className="mb-8">
    <div className="max-w-md mx-auto overflow-hidden rounded-lg shadow-lg">
      <img
        src={src}
        alt="Crop preview"
        className="w-full h-auto object-cover"
      />
    </div>
  </div>
);

const PredictionCard = ({ predictions }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
    <div className="space-y-3">
      {predictions.map((prediction, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
        >
          <span className="text-gray-700">{prediction.className}</span>
          <span className="font-semibold text-green-600">
            {(prediction.probability * 100).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  </div>
);

export { Logo, UploadButton, ImagePreview, PredictionCard };