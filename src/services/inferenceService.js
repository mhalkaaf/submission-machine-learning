const tf = require('@tensorflow/tfjs-node');
 
async function predictClassification(model, image) {
    try {
        const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        // const classes = ['Melanocytic nevus', 'Squamous cell carcinoma', 'Vascular lesion'];
    
        // const classResult = tf.argMax(prediction, 1).dataSync()[0];
        // const label = classes[classResult];

        let label, suggestion;
 
        if (confidenceScore > 50) {
            label = "Cancer";
            suggestion = "Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar dengan cepat, mudah luka atau berdarah.";
        } else {
            label = "Non-cancer";
            suggestion = "Anda sehat!"
        }
        return { confidenceScore, label, suggestion };
        
        } catch (error) {
            throw new InputError(`Terjadi kesalahan input: ${error.message}`)
        }
    
};

module.exports = predictClassification;