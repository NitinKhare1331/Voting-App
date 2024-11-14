import express from 'express';
import { PORT } from './config/serverConfig.js';
import connectDB from './config/dbConfig.js';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import router from './routes/apiRouter.js';
import cors from 'cors';

const app = express();
const server = http.createServer(app); // Pass `app` to createServer
const io = new SocketIOServer(server, {
  cors: {
    origin: 'https://voting-app-frontend-quxt.onrender.com', // Allow CORS for Socket.IO
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
});

// Middleware to attach Socket.IO instance to each request
app.use((req, res, next) => {
    req.io = io; // Attach the Socket.IO server instance to each request
    next();
});

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use('/api', router);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Use `server.listen` instead of `app.listen`
server.listen(PORT, () => {
    console.log(`Server is running successfully on ${PORT}`);
    connectDB();
});
