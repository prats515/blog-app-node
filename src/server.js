import express from 'express';
import rateLimit from "express-rate-limit";
import fs from 'fs';
import morgan from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { authenticateJWT } from './auth/authMiddleware.js';
import routes from './routes/index.js';
import userOpenRoutes from './routes/userOpenRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
const maxRequests = process.env.RATE_LIMIT_MAX || 5;
const windowMs = process.env.RATE_LIMIT_WINDOW_MS || 60000;

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export const limiter= rateLimit({
    max:parseInt(maxRequests),
    windowMs:parseInt(windowMs),
    message:"Too many requests from same IP"
    
});
app.use(limiter);
app.use('/api/user', userOpenRoutes);
app.use('/api', authenticateJWT);
app.use(routes);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
