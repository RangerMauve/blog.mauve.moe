## Neural Spatial Curves

Training a small autoencoder

---

## TODO:

- Space Filling Curves
- Auto-Encoders
- Neural Spatial Curves
- Improvements

---

### Space Filling Curves

- Maps 1 Dimension to N Dimensions
- Variable fidelity in mapping
- Fractals

---

### Hilbert Curves

![hilbert-curve.jpg]

`hilbertCurve(n) -> (X,Y)`

---

### MATH

![Equation for hilbert curves ripped from stackechange](hilbert-equation.png)

---

### Can a Neural Network do it instead?

- Smallest model possible
- Incremental improvements
- Graph inner representation
- Build intuition

---

## Auto Encoders

- Train to output same as input
- `Encoder` -> `Latent Space` -> `Decoder`
- Hourglass Shape
- Compress data to latent space
- Encoder compresses points
- Decoder is the spatial curve

---

## Structure

```graphviz
digraph {
  label="Auto Encoder"
  labelloc=t
  rankdir=TD
  bgcolor="#111"
  fontname="system-ui"
  fontcolor="#F2F2F2"
  pad=0.5
  node [
    shape=rect
    style="filled,rounded"
    fillcolor="#6e2de5"
    fontcolor="#F2F2F2"
    fontname="System-UI"
    width=2
  ]
  edge [color="#2de56e"]

  X1[label=" X (1)"]
  Y1[label=" Y (1)"]

  X2[label=" X (1)"]
  Y2[label=" Y (1)"]

  Encoder[label="Encoder (64)"]
  Decoder[label="Decoder (64)"]
  LatentSpace[label="Latent Space (1)"]

  X1 -> Encoder
  Y1 -> Encoder

  Encoder ->  LatentSpace

  LatentSpace -> Decoder

  Decoder -> X2

  Decoder -> Y2
}
```

---

## Initial Model

```python
X = np.random.rand(1000, 2)
 
# Define the autoencoder model
input_layer = Input(shape=(2,))
hidden_layer_1 = Dense(64, activation='relu')(input_layer)
# Bottleneck layer with one neuron
hidden_layer_2 = Dense(1, activation='linear')(hidden_layer_1) 
hidden_layer_3 = Dense(64, activation='relu')(hidden_layer_2)
output_layer = Dense(2)(hidden_layer_3)  # Output layer

autoencoder = Model(inputs=input_layer, outputs=output_layer)

# Compile the model
autoencoder.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
autoencoder.fit(X, X, epochs=500, batch_size=32)
```

---

## Results

![Chart linking expected to predicted, points seem pretty far apart](initial-predictions.svg)

---

## Mapping Internal Space

![Lots of predictions where it is apparent the model only knows points along an S curve](initial-mapping.svg)

---

## More Hidden Layers

![Internal curve now looks more like a four pointed star](more-layers-1.svg)

= **More complexity**

---

## Batch Size

![Line with an s curve with an extra squiggle on the bottom left and right](larger-batch.svg)

~~32~~ **256**

---

## Batch Normalization

![The curve is looking more complex and seems to be closer to what an order 2 hilbert curve](batch-normalized.svg)

Normalized Inputs = Stabilized Training

---

## More neurons

~~2 -> 64 -> 32 -> 1 -> 32 -> 64 -> 2~~
`2 -> 128 -> 64 -> 1 -> 64 -> 128 -> 2`

![Similar shape as batch normalized but more squiggly](more-neurons-1.svg)

---

## Dropout Layers

![Drastically simplified horseshoe shape](./dropout-layers.svg)

Reducing complexity helps improve generalization.

We kinda want the complexity here 😅

---

## More Layers

![Curve is more uneven and wiggly](more-layers-2.svg)

~~128 -> 64~~
`256 -> 128 -> 64`

---

## More Neurons!!

![Seems like a hilbert curve with an extra order of precision](./more-neurons-2.svg)

~~256 -> 128 -> 64~~
`512 -> 256 -> 128`

---

## Mean Absolute Error Loss Function

![Curve has fewer straight lines and is more organic looking](./mean-absolute-error.svg)

- Better for nonlinear relationships
- Robust to large variation in data

---

## Dynamic Learning Rate

```python
ReduceLROnPlateau(
     monitor='loss',  # Monitor loss
     # Epochs without improvement before learning rate is reduced
     patience=3,
     # Factor by which the learning rate will be reduced
     factor=0.5,
     # Minimum learning rate to prevent it from becoming too low
     min_lr=1e-6         
 )
```

---

## Reduce LR On Plateau Result

![Similar level of complexity, maybe a bit less wiggly](./dynamic-learning-rate.svg)

---

## Way more epocs

![Slightly more complex shape than before](./more-epochs.svg)

---

## Conclusions

- Least Complex model "good enough"
- Size / Depth makes a huge difference
- Normalization can help with training
- Linear activation at the end

---

- Come chat [on matrix](https://matrix.to/#/#userless-agents:mauve.moe)
- `contact@mauve.moe`