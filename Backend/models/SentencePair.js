// backend/models/SentencePair.js
const mongoose = require('mongoose');

const SentenceSchema = new mongoose.Schema({
    task : {type: mongoose.Types.ObjectId, ref: 'Task'},
    index: {
        type: String,
        required: true
    },
    english: {
        type: String,
        required: true
    },
    hindi: {
        type: String,
        required: true
    },
    seriousness: {
        type: String,
    },
    mistranslation: {
        type: String,
    },
    spelling: {
        type: String,
    },
    contextual_error: {
        type: String,
    },
    tone: {
        type: String,
    },
    lexical_word_choice: {
        type: String,
    },
    punctuation: {
        type: String,
    },
    done: {
        type: Boolean,
        default: false
    }
});

const SentencePairModel = mongoose.model('SentencePair', SentenceSchema);

module.exports = SentencePairModel;
