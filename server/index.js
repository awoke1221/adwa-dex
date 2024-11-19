import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';
import connectDB from './config/database.js';
import logger from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import tokenRoutes from './routes/tokenRoutes.js';
import poolRoutes from './routes/poolRoutes.js';
import PriceService from './services/PriceService.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/pools', poolRoutes);

// WebSocket connections
io.on('connection', (socket) => {
  logger.info('Client connected');
  
  socket.on('subscribeToPair', ({ tokenIn, tokenOut }) => {
    const unsubscribeA = PriceService.subscribe(tokenIn, (price) => {
      socket.emit('priceUpdate', { token: tokenIn, price });
    });
    
    const unsubscribeB = PriceService.subscribe(tokenOut, (price) => {
      socket.emit('priceUpdate', { token: tokenOut, price });
    });

    socket.on('disconnect', () => {
      unsubscribeA();
      unsubscribeB();
      logger.info('Client disconnected');
    });
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});