const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const ClientError = require('../exceptions/ClientError');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        const { label, suggestion } = await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": suggestion,
        "createdAt": createdAt
      }
    
    await storeData(id, data);
    
    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    })
    response.code(201);
    return response;
    } catch (error) {
        // Assume predictClassification throws an error for invalid image format or shape
        if (error.message.includes('invalid image format or shape')) {
            throw new ClientError('Terjadi kesalahan dalam melakukan prediksi');
        }
        // Re-throw the error if it's not a prediction-related error
        throw error;
    }
    
}


module.exports = postPredictHandler;