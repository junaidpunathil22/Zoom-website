const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    building: { type: String, required: true },
    apartment: { type: String, required: true },
    email: { type: String },
    role: { type: String, default: 'tenant' }
});

module.exports = mongoose.model('Tenant', tenantSchema);
