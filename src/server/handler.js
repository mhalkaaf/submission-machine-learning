const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const InputError = require('../exceptions/InputError');
const PredictionError = require('../exceptions/PredictionError');

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
        return h.response(response).code(201);
    } catch (error) {
        throw new PredictionError('Terjadi kesalahan dalam melakukan prediksi');
    }
}


module.exports = postPredictHandler;