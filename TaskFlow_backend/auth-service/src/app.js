require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Eureka = require('eureka-js-client').Eureka;
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/auth.routes');
const User = require('./models/User');

const app = express();
const client = require('prom-client');
client.collectDefaultMetrics();

app.use(express.json());

app.get('/actuator/health', (req, res) => res.json({ status: 'UP' }));
app.get('/health', (req, res) => res.json({ status: 'UP' }));

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // ← Swagger UI
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

        await seedAdmin();

        app.listen(process.env.PORT, () => {
            console.log(`🚀 Auth service running on port ${process.env.PORT}`);

            const instanceHostname = process.env.EUREKA_INSTANCE_HOSTNAME || 'localhost';
            const instanceIp = process.env.EUREKA_INSTANCE_IP || '127.0.0.1';
            const eurekaHost = process.env.EUREKA_HOST || 'localhost';
            const eurekaPort = process.env.EUREKA_PORT || 8761;

            const eurekaClient = new Eureka({
                instance: {
                    app: 'AUTH-SERVICE',
                    hostName: instanceHostname,
                    ipAddr: instanceIp,
                    port: { '$': parseInt(process.env.PORT), '@enabled': true },
                    vipAddress: 'auth-service',
                    dataCenterInfo: { '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo', name: 'MyOwn' },
                    healthCheckUrl: `http://${instanceHostname}:${process.env.PORT}/health`,
                    statusPageUrl:  `http://${instanceHostname}:${process.env.PORT}/health`,
                },
                eureka: {
                    host: eurekaHost,
                    port: eurekaPort,
                    servicePath: '/eureka/apps/',
                    maxRetries: 15,
                    requestRetryDelay: 3000,
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