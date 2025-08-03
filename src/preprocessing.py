import os, shutil, random
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def restructure_and_split(test_dir, train_dir, val_dir, val_split=0.2):
    classes = ["MALNUTRITION", "NUTRITION"]
    for cls in classes:
        os.makedirs(os.path.join(train_dir, cls), exist_ok=True)
        os.makedirs(os.path.join(val_dir, cls), exist_ok=True)
        for fname in os.listdir(os.path.join(test_dir, cls)):
            shutil.move(os.path.join(test_dir, cls, fname), os.path.join(train_dir, cls, fname))
        images = os.listdir(os.path.join(train_dir, cls))
        random.shuffle(images)
        val_count = int(len(images) * val_split)
        for fname in images[:val_count]:
            shutil.move(os.path.join(train_dir, cls, fname), os.path.join(val_dir, cls, fname))

def get_data_generators(train_dir, val_dir, img_size=(224, 224), batch_size=32):
    train_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
        train_dir, target_size=img_size, batch_size=batch_size, class_mode='binary', shuffle=True)
    val_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
        val_dir, target_size=img_size, batch_size=batch_size, class_mode='binary', shuffle=False)
    return train_gen, val_gen
