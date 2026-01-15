const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'pending' }, // 'pending', 'inprogress', 'resolved'
    date: { type: String, required: true }
});

module.exports = mongoose.model('Complaint', complaintSchema);
