const ClientError = require('./ClientError');

class PredictionError extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'PredictionError';
    }
}

module.exports = PredictionError;