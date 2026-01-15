const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Tenant = require('./models/Tenant');
const Staff = require('./models/Staff');
const Complaint = require('./models/Complaint');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/zoom-real-estate')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API Endpoints ---

// 1. Tenants
app.get('/api/tenants', async (req, res) => {
    try {
        const tenants = await Tenant.find();
        res.json(tenants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tenants', async (req, res) => {
    try {
        const newTenant = new Tenant(req.body);
        const savedTenant = await newTenant.save();
        res.json(savedTenant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/tenants/:id', async (req, res) => {
    try {
        await Tenant.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tenant deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/tenants/:id', async (req, res) => {
    try {
        const updated = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Staff
app.get('/api/staff', async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/staff', async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
        const savedStaff = await newStaff.save();
        res.json(savedStaff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/staff/:id', async (req, res) => {
    try {
        const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/complaints', async (req, res) => {
    try {
        const newComplaint = new Complaint(req.body);
        const saved = await newComplaint.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/complaints/:id', async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Login (Admin hardcoded, Tenants from DB)
app.post('/api/login', async (req, res) => {
    const { username, password, type } = req.body;
    console.log(`Login attempt: User=${username}, Pass=${password}, Type=${type}`);

    if (type === 'admin') {
        if (username === 'zoom4404' && password === 'Zoom123') {
            res.json({ success: true, user: { username: 'zoom4404', role: 'admin' } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
        }
    } else {
        // Tenant Login
        const tenant = await Tenant.findOne({ username, password });
        if (tenant) {
            res.json({ success: true, user: { ...tenant.toObject(), id: tenant._id, role: 'tenant' } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Tenant Credentials' });
        }
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
