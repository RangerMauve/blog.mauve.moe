# How I Learned To Control Computers With My Mind

## Tools

### Muse 2 EEG

This is a simple EEG which monitor four brain regions as well as the wearers heart rate and head position. I bout this during their Black Friday sale and while it's not the fanciest option it gets the job done.

### Burn

[Burn](https://burn.dev/burn-book/basic-workflow/training.html) is kinda like PyTorch but for Rust. It provides bindings to different "backends" using idiomatic Rust and makes it easy to go from training models to running them.

## Signal Processing

## Training Data

- Define Categories + "neutral"
- Default "Left/Right/Forward/Backward/Up/Down/Select/Cancel"
- Prompt Different Categories
- Record raw EEG/Sensor data (cut off first second as the "reaction time")

## Model Structure

- Batch of sensor data over several seconds
- Output 0-1 for each category

## Training Duration and Parameter Comparison

## Results

## Future Work