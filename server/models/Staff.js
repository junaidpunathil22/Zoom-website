const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true }, // 'cleaner' or 'driver'
    building: { type: String, required: true },
    salary: { type: Number, required: true },
    paid: { type: Boolean, default: false }
});

module.exports = mongoose.model('Staff', staffSchema);
