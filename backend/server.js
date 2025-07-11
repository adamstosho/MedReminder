require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');

const authRoutes = require('./routes/auth');
const medicationRoutes = require('./routes/medications');
const logRoutes = require('./routes/logs');
const exportRoutes = require('./routes/export');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');



const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

app.use(express.json());

// Connect to MongoDB
connectDB();

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8')
);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/export', exportRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend is running!' });
});


// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 