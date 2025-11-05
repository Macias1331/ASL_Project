import * as tf from '@tensorflow/tfjs';

// Simple feedforward network for hand pose classification
export async function createModel(numClasses: number) {
  const model = tf.sequential();
  
  // Input shape: 42 features (21 landmarks x 2 coordinates)
  model.add(tf.layers.dense({
    inputShape: [42],
    units: 128,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dropout({ rate: 0.3 }));
  
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dropout({ rate: 0.3 }));
  
  // Output layer
  model.add(tf.layers.dense({
    units: numClasses,
    activation: 'softmax'
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

// Convert samples to tensors
export function prepareTensorData(samples: Array<{features: number[], label: string}>) {
  const uniqueLabels = Array.from(new Set(samples.map(s => s.label))).sort();
  const labelToIndex = Object.fromEntries(uniqueLabels.map((l, i) => [l, i]));
  
  const xs = tf.stack(samples.map(s => tf.tensor1d(s.features)));
  const ys = tf.oneHot(
    samples.map(s => labelToIndex[s.label]),
    uniqueLabels.length
  );
  
  return {
    xs,
    ys,
    labelToIndex,
    indexToLabel: uniqueLabels
  };
}

// Train model on collected samples
export async function trainModel(
  samples: Array<{features: number[], label: string}>,
  epochs = 50,
  batchSize = 32,
  validationSplit = 0.2
) {
  const {xs, ys, labelToIndex, indexToLabel} = prepareTensorData(samples);
  const model = await createModel(indexToLabel.length);
  
  // Train
  await model.fit(xs, ys, {
    epochs,
    batchSize,
    validationSplit,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
      }
    }
  });

  return {
    model,
    labelToIndex,
    indexToLabel
  };
}

// Smooth predictions using a sliding window
export class PredictionSmoother {
  private window: Array<{label: string, confidence: number}> = [];
  private windowSize: number;
  
  constructor(windowSize = 5) {
    this.windowSize = windowSize;
  }
  
  addPrediction(label: string, confidence: number) {
    this.window.push({label, confidence});
    if (this.window.length > this.windowSize) {
      this.window.shift();
    }
  }
  
  // Get smoothed prediction (most frequent in window)
  getSmoothedPrediction() {
    if (this.window.length === 0) return null;
    
    const counts = new Map<string, {count: number, totalConf: number}>();
    
    for (const pred of this.window) {
      const current = counts.get(pred.label) || {count: 0, totalConf: 0};
      counts.set(pred.label, {
        count: current.count + 1,
        totalConf: current.totalConf + pred.confidence
      });
    }
    
    let bestLabel = '';
    let maxCount = 0;
    let avgConf = 0;
    
    for (const [label, {count, totalConf}] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        bestLabel = label;
        avgConf = totalConf / count;
      }
    }
    
    return {
      label: bestLabel,
      confidence: avgConf
    };
  }
  
  clear() {
    this.window = [];
  }
}