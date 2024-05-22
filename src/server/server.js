// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const loadModel = require('../services/loadModel');
// const InputError = require('../exceptions/InputError');
// const predictRouter = require('./handler'); // Sesuaikan dengan lokasi file rute Anda

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware untuk CORS
// app.use(cors());

// // Middleware untuk parsing JSON dan URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Inisialisasi model dan menambahkannya ke `app.locals`
// loadModel().then(model => {
//     app.locals.model = model;

//     // Menggunakan rute
//     app.use('/api', predictRouter);

//     // Middleware untuk error handling
//     app.use((err, req, res, next) => {
//         if (err instanceof InputError) {
//             res.status(err.statusCode).json({
//                 status: 'fail',
//                 message: `${err.message} Silakan gunakan foto lain.`
//             });
//         } else if (err) {
//             res.status(err.statusCode || 500).json({
//                 status: 'fail',
//                 message: err.message || 'Internal Server Error'
//             });
//         } else {
//             next();
//         }
//     });

//     // Menjalankan server
//     app.listen(PORT, () => {
//         console.log(`Server started at http://0.0.0.0:${PORT}`);
//     });
// }).catch(err => {
//     console.error('Error loading model:', err);
// });

const express = require('express');
const cors = require('cors');
const loadModel = require('../services/loadModel');
const predictRoute = require('./routes/predictRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load the model and store it in app.locals
loadModel().then(model => {
    app.locals.model = model;

    // Use the predict route
    app.use('/api', predictRoute);

    // Error handling middleware
    app.use((err, req, res, next) => {
        if (err) {
            res.status(err.statusCode || 500).json({
                status: 'fail',
                message: err.message || 'Internal Server Error',
            });
        } else {
            next();
        }
    });

    app.listen(PORT, () => {
        console.log(`Server started at http://0.0.0.0:${PORT}`);
    });
}).catch(err => {
    console.error('Error loading model:', err);
});