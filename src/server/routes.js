const express = require('express');
const multer = require('multer');
const postPredictHandler = require('./handler');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/predict', upload.single('image'), postPredictHandler);

module.exports = router;