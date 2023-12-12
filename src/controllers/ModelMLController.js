// controllers/ModelMLController.js
// npm install --save-exact @tensorflow/tfjs-node@3.1.0
const tf = require("@tensorflow/tfjs-node");
const modelPath = "..\modelml\fruition_model.h5"; // Sesuaikan path model dengan lokasi sebenarnya

let loadedModel;

// Fungsi untuk memuat model
async function loadModel() {
  try {
    loadedModel = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Failed to load the model:", error);
    throw error;
  }
}

// Memuat model saat aplikasi dimulai
(async () => {
  try {
    await loadModel();
  } catch (error) {
    console.error("Failed to load the model:", error);
  }
})();

// Controller untuk melakukan prediksi
const predict = async (req, res) => {
  try {
    if (!loadedModel) {
      return res.status(404).json({ message: "Model has not been loaded yet" });
    }

    const inputData = req.body; // Sesuaikan dengan data input yang sesuai dengan model
    const inputTensor = tf.tensor(/* Format input yang sesuai dengan model */);
    const output = loadedModel.predict(inputTensor);

    res.json({ prediction: output });
  } catch (error) {
    res.status(500).json({ error: "Failed to make prediction" });
  }
};

const getModelInfo = (req, res) => {
  try {
    if (!loadedModel) {
      return res.status(404).json({ message: "Model has not been loaded yet" });
    }

    const modelInfo = {
      modelPath,
      layers: loadedModel.layers.map((layer) => layer.name),
      inputShape: loadedModel.input.shape,
      outputShape: loadedModel.output.shape,
    };

    res.json({ modelInfo });
  } catch (error) {
    res.status(500).json({ error: "Failed to get model information" });
  }
};

module.exports = {
  predict,
  getModelInfo,
};
