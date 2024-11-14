import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers
from tensorflow.keras.models import Model
import os
import json

# Define disease information
DISEASE_INFO = {
    'Apple___Apple_scab': {
        'cause': 'Fungal infection (Venturia inaequalis) that develops in spring when temperatures are between 55-75°F and leaves remain wet for long periods.',
        'remedy': '• Remove and destroy fallen leaves\n• Prune trees to improve air circulation\n• Apply fungicides in early spring\n• Maintain proper tree spacing\n• Use resistant apple varieties when possible',
        'preventiveMeasures': '• Plant resistant varieties\n• Proper sanitation practices\n• Regular monitoring\n• Maintain tree vigor through proper fertilization'
    },
    'Apple___Black_rot': {
        'cause': 'Fungal pathogen (Botryosphaeria obtusa) that infects trees through wounds, dead tissue, or other injuries.',
        'remedy': '• Remove infected fruit and cankers\n• Prune out dead or diseased branches\n• Apply fungicides during growing season\n• Maintain good sanitation\n• Proper pruning techniques',
        'preventiveMeasures': '• Regular orchard cleanup\n• Avoid tree wounds\n• Proper pruning timing\n• Adequate spacing between trees'
    },
    'Apple___Cedar_apple_rust': {
        'cause': 'Fungal disease (Gymnosporangium juniperi-virginianae) requiring both apple trees and juniper plants to complete its life cycle.',
        'remedy': '• Remove nearby juniper plants\n• Apply fungicides in spring\n• Prune affected branches\n• Monitor trees regularly\n• Use resistant varieties',
        'preventiveMeasures': '• Plant resistant varieties\n• Maintain distance from juniper trees\n• Regular inspection\n• Proper timing of fungicide applications'
    },
    'Apple___healthy': {
        'cause': 'N/A - Healthy plant',
        'remedy': 'Continue good agricultural practices',
        'preventiveMeasures': '• Regular pruning\n• Proper fertilization\n• Adequate irrigation\n• Regular monitoring'
    },

    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
        'cause': 'Fungal pathogen (Cercospora zeae-maydis) thriving in humid conditions with temperatures between 75-85°F.',
        'remedy': '• Rotate crops\n• Remove crop debris\n• Apply fungicides when needed\n• Improve air circulation\n• Plant resistant hybrids',
        'preventiveMeasures': '• Crop rotation\n• Proper plant spacing\n• Balanced fertilization\n• Timely planting'
    },
    'Corn(maize)___Common_rust': {
        'cause': 'Fungal disease (Puccinia sorghi) spread by airborne spores, favored by cool, moist conditions.',
        'remedy': '• Apply fungicides early in infection\n• Monitor fields regularly\n• Remove infected plants\n• Improve air circulation\n• Use resistant varieties',
        'preventiveMeasures': '• Plant resistant hybrids\n• Early planting\n• Regular monitoring\n• Proper spacing'
    },
    'Corn(maize)___Northern_Leaf_Blight': {
        'cause': 'Fungal infection (Exserohilum turcicum) favored by moderate temperatures and high humidity.',
        'remedy': '• Apply fungicides\n• Remove infected debris\n• Crop rotation\n• Improve drainage\n• Use resistant hybrids',
        'preventiveMeasures': '• Crop rotation\n• Residue management\n• Proper plant spacing\n• Balanced fertilization'
    },
    'Corn(maize)___healthy': {
        'cause': 'N/A - Healthy plant',
        'remedy': 'Continue good agricultural practices',
        'preventiveMeasures': '• Regular monitoring\n• Proper irrigation\n• Balanced fertilization\n• Weed control'
    },

    'Potato___Early_blight': {
        'cause': 'Fungal disease (Alternaria solani) favored by warm temperatures and high humidity.',
        'remedy': '• Apply fungicides\n• Remove infected leaves\n• Improve air circulation\n• Proper irrigation timing\n• Crop rotation',
        'preventiveMeasures': '• Proper plant spacing\n• Crop rotation\n• Clean seed potatoes\n• Regular monitoring'
    },
    'Potato___Late_blight': {
        'cause': 'Fungal disease (Phytophthora infestans) thriving in cool, wet conditions.',
        'remedy': '• Apply fungicides preventively\n• Remove infected plants\n• Improve drainage\n• Destroy volunteer plants\n• Monitor weather conditions',
        'preventiveMeasures': '• Use certified seed potatoes\n• Proper hilling\n• Adequate spacing\n• Weather monitoring'
    },
    'Potato___healthy': {
        'cause': 'N/A - Healthy plant',
        'remedy': 'Continue good agricultural practices',
        'preventiveMeasures': '• Regular monitoring\n• Proper irrigation\n• Balanced fertilization\n• Crop rotation'
    }
}


def create_model(num_classes):
    """Create and return the model architecture"""
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    base_model.trainable = False

    model = tf.keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

def main():
    # Dataset path and class names
    dataset_path = 'PlantsDataset'
    class_names = sorted([d for d in os.listdir(dataset_path) 
                         if os.path.isdir(os.path.join(dataset_path, d))])
    num_classes = len(class_names)

    # Save class mapping
    class_mapping = {i: name for i, name in enumerate(class_names)}
    with open('class_mapping.json', 'w') as f:
        json.dump(class_mapping, f)

    # Data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    # Data generators
    train_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='training',
        classes=class_names,
        shuffle=True
    )

    validation_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='validation',
        classes=class_names,
        shuffle=False
    )

    # Create and compile model
    model = create_model(num_classes)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Train model
    history = model.fit(
        train_generator,
        epochs=10,
        validation_data=validation_generator,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=3,
                restore_best_weights=True
            )
        ]
    )

    # Save model
    model.save('plant_disease_model.h5')

    # Convert to TensorFlow.js format
    os.system('tensorflowjs_converter --input_format keras plant_disease_model.h5 tfjs_model')

    # Save combined info for frontend
    frontend_info = {
        'class_mapping': class_mapping,
        'disease_info': DISEASE_INFO
    }
    
    os.makedirs('public', exist_ok=True)
    with open('public/model_info.json', 'w') as f:
        json.dump(frontend_info, f)

if __name__ == "__main__":
    main()