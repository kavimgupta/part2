const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    message: String,
    status: { type: String, enum: ['SENT', 'FAILED'], default: 'PENDING' },
}, { timestamps: true });

const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);

module.exports = CommunicationLog;
