require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Eureka = require('eureka-js-client').Eureka;
const authRoutes = require('./routes/auth.routes');
const User = require('./models/User');

const app = express();

app.use(express.json());

app.get('/actuator/health', (req, res) => res.json({ status: 'UP' }));
app.get('/health', (req, res) => res.json({ status: 'UP' }));

app.use('/auth', authRoutes);

// ✅ Seed admin if not exists
async function seedAdmin() {
    const existing = await User.findOne({ role: 'ADMIN' });
    if (existing) {
        console.log('ℹ️ Admin already exists, skipping seed');
        return;
    }
    const admin = new User({
        username: 'admin',
        email: 'admin@taskflow.com',
        password: 'Admin@1234',
        role: 'ADMIN'
    });
    await admin.save();
    console.log('✅ Admin created: admin@taskflow.com / Admin@1234');
}

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');

        await seedAdmin(); // ← runs once on startup

        app.listen(process.env.PORT, () => {
            console.log(`🚀 Auth service running on port ${process.env.PORT}`);

            const eurekaClient = new Eureka({
                instance: {
                    app: 'AUTH-SERVICE',
                    hostName: 'localhost',
                    ipAddr: '127.0.0.1',
                    port: { '$': parseInt(process.env.PORT), '@enabled': true },
                    vipAddress: 'auth-service',
                    dataCenterInfo: { '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo', name: 'MyOwn' },
                    healthCheckUrl: `http://localhost:${process.env.PORT}/health`,
                    statusPageUrl:  `http://localhost:${process.env.PORT}/health`,
                },
                eureka: {
                    host: 'localhost',
                    port: 8761,
                    servicePath: '/eureka/apps/',
                },
            });

            eurekaClient.start(err => {
                if (err) console.error('Eureka registration failed:', err);
                else console.log('✅ Registered with Eureka');
            });
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });