const tf = require('@tensorflow/tfjs-node');

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

async function loadModel() {
    return tf.loadGraphModel(process.env.MODEL_URL);
}

module.exports = loadModel;