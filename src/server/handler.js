// const express = require('express');
// const crypto = require('crypto');
// const predictClassification = require('../services/inferenceService');
// const storeData = require('../services/storeData');

// const router = express.Router();

// // Middleware untuk meng-handle request JSON dan URL-encoded
// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));

// // Handler untuk rute POST /predict
// router.post('/predict', async (req, res) => {
//     try {
//         const { image } = req.body; // Mengambil image dari request body
//         const model = req.app.locals.model; // Mengambil model dari application locals

//         const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);

//         const id = crypto.randomUUID();
//         const createdAt = new Date().toISOString();

//         const data = {
//             id,
//             result: label,
//             explanation,
//             suggestion,
//             confidenceScore,
//             createdAt,
//         };

//         await storeData(id, data);

//         const message = confidenceScore > 99 
//             ? 'Model is predicted successfully.' 
//             : 'Model is predicted successfully but under threshold. Please use the correct picture';

//         res.status(201).json({
//             status: 'success',
//             message,
//             data,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Internal Server Error',
//         });
//     }
// });

// module.exports = router;

const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(req, res) {
    try {
        const image = req.file;
        if (!image) {
            throw new InputError('No image provided');
        }

        const { model } = req.app.locals;

        const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image.buffer);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            explanation,
            suggestion,
            confidenceScore,
            createdAt,
        };

        await storeData(id, data);

        const message = confidenceScore > 99
            ? 'Model is predicted successfully.'
            : 'Model is predicted successfully but under threshold. Please use the correct picture';

        res.status(201).json({
            status: 'success',
            message,
            data,
        });
    } catch (error) {
        if (error instanceof InputError) {
            return res.status(400).json({
                status: 'fail',
                message: error.message,
            });
        }
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}

module.exports = postPredictHandler;