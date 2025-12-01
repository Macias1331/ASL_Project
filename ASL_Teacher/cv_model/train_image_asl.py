"""
Train ASL Fingerspelling Model using Image Dataset

This script trains a CNN model using the ASL RGB-Depth Fingerspelling dataset,
which contains images of hand gestures for letters A-Y (excluding J and Z).

Dataset: https://www.kaggle.com/datasets/mrgeislinger/asl-rgb-depth-fingerspelling-spelling-it-out

Requirements:
    pip install numpy tensorflow scikit-learn kaggle tensorflowjs opencv-python
"""

import os
import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
import subprocess
from pathlib import Path
import cv2
from glob import glob

# Configuration
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR / 'asl_image_data'
MODEL_OUTPUT = SCRIPT_DIR.parent / 'frontend' / 'public' / 'models' / 'asl_alphabet'
KAGGLE_DATASET = 'mrgeislinger/asl-rgb-depth-fingerspelling-spelling-it-out'
IMAGE_SIZE = (128, 128)  # Resize images to this size
BATCH_SIZE = 32
EPOCHS = 20
VALIDATION_SPLIT = 0.2

# Letter labels - Starting with just A, B, C for faster prototype
LETTERS = ['A', 'B', 'C']


def print_header():
    """Print script header."""
    print("=" * 70)
    print("ASL Fingerspelling Model Training (Image-Based)")
    print("Using Kaggle Dataset: ASL RGB-Depth Fingerspelling")
    print("=" * 70)
    print()


def setup_kaggle():
    """Check if Kaggle API credentials are configured."""
    print("📋 Checking Kaggle setup...")
    kaggle_dir = Path.home() / '.kaggle'
    kaggle_json = kaggle_dir / 'kaggle.json'
    
    if not kaggle_json.exists():
        print("\n⚠️  Kaggle API credentials not found!")
        print("\nTo download the dataset, you need to:")
        print("1. Go to https://www.kaggle.com/settings")
        print("2. Scroll to 'API' section")
        print("3. Click 'Create New Token'")
        print(f"4. Save kaggle.json to: {kaggle_dir}")
        print("\nAfter setting up, run this script again.")
        return False
    
    print("✅ Kaggle credentials found")
    return True


def download_dataset():
    """Download dataset from Kaggle."""
    if DATA_DIR.exists():
        print(f"✅ Dataset directory already exists: {DATA_DIR}")
        return True
    
    print(f"\n📥 Downloading dataset from Kaggle...")
    print(f"   Dataset: {KAGGLE_DATASET}")
    print(f"   Destination: {DATA_DIR}")
    print("   This may take a few minutes...")
    
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        
        # Download using Kaggle API
        result = subprocess.run(
            ['kaggle', 'datasets', 'download', '-d', KAGGLE_DATASET, '-p', str(DATA_DIR), '--unzip'],
            check=True,
            capture_output=True,
            text=True
        )
        
        print("✅ Dataset downloaded and extracted successfully")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error downloading dataset:")
        print(f"   {e.stderr}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False


def load_images_from_directory(data_dir, max_per_class=None):
    """Load images from directory structure."""
    print(f"\n📂 Loading images from: {data_dir}")
    print(f"   Training on letters: {', '.join(LETTERS)}")
    if max_per_class:
        print(f"   Using max {max_per_class} images per letter")
    else:
        print(f"   Using ALL images per letter")
    
    # Find image files for letters A, B, C from people/variations a, b, c
    # Structure: A/a/, A/b/, A/c/, B/a/, B/b/, B/c/, C/a/, C/b/, C/c/
    image_files = []
    people = ['a', 'b', 'c']  # Using data from people a, b, c
    
    for letter in LETTERS:
        for person in people:
            pattern = str(data_dir / 'dataset5' / letter / person / '*.png')
            files = glob(pattern)
            image_files.extend(files)
    
    # Also try jpg
    for letter in LETTERS:
        for person in people:
            pattern = str(data_dir / 'dataset5' / letter / person / '*.jpg')
            image_files.extend(glob(pattern))
    
    if not image_files:
        print(f"❌ No images found in {data_dir}")
        print(f"   Please check the dataset structure")
        return None, None
    
    print(f"   Found {len(image_files)} total images")
    
    # Group files by letter
    files_by_letter = {letter: [] for letter in LETTERS}
    
    for img_path in image_files:
        parts = Path(img_path).parts
        label = None
        
        # Look specifically for single-letter directories (like dataset5/A/)
        for i, part in enumerate(parts):
            if part == 'dataset5' and i + 1 < len(parts):
                # Next part should be the letter
                potential_label = parts[i + 1].upper()
                if len(potential_label) == 1 and potential_label in LETTERS:
                    label = potential_label
                    break
        
        if label and label in files_by_letter:
            files_by_letter[label].append(img_path)
    
    # Sample max_per_class from each letter (if specified)
    selected_files = []
    for letter, files in files_by_letter.items():
        if max_per_class and len(files) > max_per_class:
            import random
            random.seed(42)
            selected_files.extend(random.sample(files, max_per_class))
        else:
            selected_files.extend(files)
    
    print(f"   Selected {len(selected_files)} images for letters: {', '.join(LETTERS)}")
    
    # Show distribution
    for letter in LETTERS:
        count = len(files_by_letter[letter])
        print(f"   {letter}: {count} images")
    
    print(f"   Loading {len(selected_files)} sampled images...")
    
    images = []
    labels = []
    
    for i, img_path in enumerate(selected_files):
        if i % 1000 == 0 and i > 0:
            print(f"   Loaded {i}/{len(selected_files)} images...")
        
        # Get label from dataset5/LETTER/ structure
        parts = Path(img_path).parts
        label = None
        for i, part in enumerate(parts):
            if part == 'dataset5' and i + 1 < len(parts):
                potential_label = parts[i + 1].upper()
                if len(potential_label) == 1 and potential_label in LETTERS:
                    label = potential_label
                    break
        
        if not label:
            continue
        
        # Load and preprocess image
        img = cv2.imread(img_path)
        if img is None:
            continue
        
        # Convert BGR to RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize
        img = cv2.resize(img, IMAGE_SIZE)
        
        # Normalize to [0, 1]
        img = img.astype(np.float32) / 255.0
        
        images.append(img)
        labels.append(label)
    
    print(f"   ✅ Loaded {len(images)} valid images")
    
    # Convert to numpy arrays
    X = np.array(images)
    y = np.array(labels)
    
    # Print distribution
    unique, counts = np.unique(y, return_counts=True)
    print("\n📊 Dataset distribution:")
    for letter, count in zip(unique, counts):
        print(f"   {letter}: {count} images")
    
    return X, y


def create_cnn_model(num_classes):
    """Create a CNN model for image classification."""
    print(f"\n🏗️  Building CNN model...")
    print(f"   Input shape: {IMAGE_SIZE + (3,)}")
    print(f"   Output classes: {num_classes}")
    
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=IMAGE_SIZE + (3,)),
        
        # First conv block
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Second conv block
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Third conv block
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.4),
        
        # Dense layers
        layers.Flatten(),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        # Output layer
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("\n📋 Model architecture:")
    model.summary()
    
    return model


def train_model(model, X_train, y_train, X_val, y_val):
    """Train the model with data augmentation."""
    print("\n🎯 Training model...")
    print(f"   Training samples: {len(X_train)}")
    print(f"   Validation samples: {len(X_val)}")
    print(f"   Batch size: {BATCH_SIZE}")
    print(f"   Epochs: {EPOCHS}")
    
    # Data augmentation
    datagen = ImageDataGenerator(
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=False,  # Don't flip for ASL
        fill_mode='nearest'
    )
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=7,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
        keras.callbacks.ModelCheckpoint(
            str(SCRIPT_DIR / 'best_model.keras'),
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Train
    history = model.fit(
        datagen.flow(X_train, y_train, batch_size=BATCH_SIZE),
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1
    )
    
    # Final evaluation
    print("\n✅ Training completed!")
    val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
    print(f"\n📊 Final Results:")
    print(f"   Validation Loss: {val_loss:.4f}")
    print(f"   Validation Accuracy: {val_acc*100:.2f}%")
    
    return history


def save_for_browser(model, label_encoder):
    """Convert and save model for TensorFlow.js."""
    print("\n💾 Converting model to TensorFlow.js format...")
    
    # Create output directory
    MODEL_OUTPUT.mkdir(parents=True, exist_ok=True)
    
    # Save model in TensorFlow.js format
    tfjs_path = MODEL_OUTPUT
    
    # Export model using model.export (for TensorFlow SavedModel format)
    saved_model_path = SCRIPT_DIR / 'saved_model'
    model.export(str(saved_model_path))
    
    # Convert to TensorFlow.js
    import tensorflowjs as tfjs
    tfjs.converters.convert_tf_saved_model(
        str(saved_model_path),
        str(tfjs_path)
    )
    
    print(f"✅ Model saved to: {tfjs_path}")
    
    # Save labels
    labels_file = MODEL_OUTPUT / 'labels.json'
    with open(labels_file, 'w') as f:
        json.dump({
            'labels': label_encoder.classes_.tolist(),
            'num_classes': len(label_encoder.classes_)
        }, f, indent=2)
    
    print(f"✅ Labels saved to: {labels_file}")
    
    # Save model info
    info_file = MODEL_OUTPUT / 'model_info.json'
    with open(info_file, 'w') as f:
        json.dump({
            'type': 'cnn',
            'input_shape': list(IMAGE_SIZE) + [3],
            'output_classes': len(label_encoder.classes_),
            'image_size': list(IMAGE_SIZE),
            'normalized': True,
            'color_space': 'RGB'
        }, f, indent=2)
    
    print(f"✅ Model info saved to: {info_file}")
    print(f"\n🎉 Model is ready for browser deployment!")
    print(f"   Frontend can load from: /models/asl_alphabet/tfjs_model/model.json")


def main():
    """Main training pipeline."""
    print_header()
    
    # Step 1: Check Kaggle setup
    if not setup_kaggle():
        sys.exit(1)
    
    # Step 2: Download dataset
    if not download_dataset():
        sys.exit(1)
    
    # Step 3: Load and preprocess data
    X, y = load_images_from_directory(DATA_DIR)
    
    if X is None or len(X) == 0:
        print("\n❌ Failed to load dataset. Please check the dataset structure.")
        sys.exit(1)
    
    # Step 4: Encode labels
    from sklearn.preprocessing import LabelEncoder
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    print(f"\n🔢 Label encoding:")
    for i, label in enumerate(label_encoder.classes_):
        print(f"   {label} -> {i}")
    
    # Step 5: Split data
    X_train, X_val, y_train, y_val = train_test_split(
        X, y_encoded, test_size=VALIDATION_SPLIT, random_state=42, stratify=y_encoded
    )
    
    # Step 6: Create model
    model = create_cnn_model(len(label_encoder.classes_))
    
    # Step 7: Train model
    history = train_model(model, X_train, y_train, X_val, y_val)
    
    # Step 8: Save for browser
    save_for_browser(model, label_encoder)
    
    print("\n" + "=" * 70)
    print("✨ Training complete! Next steps:")
    print("=" * 70)
    print("1. Update FingerSpelling.tsx to load the CNN model from /models/asl_alphabet/tfjs_model/model.json")
    print("2. Add image preprocessing in the frontend to match training (resize to 128x128, normalize)")
    print("3. Run: cd frontend && npm run dev")
    print("4. Test at: http://localhost:5173/fingerspelling")


if __name__ == '__main__':
    main()
