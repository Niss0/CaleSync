import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(cors());                // Allows requests from different domains
app.use(express.json());        // Enables parsing of JSON bodies
app.use(express.urlencoded({ extended: true }));  // Enables parsing of URL-encoded bodies
connectDB().catch(err => console.error('Database connection error:', err));


// Basic test route
app.get('/', (req: Request, res: Response) => {
    res.send('CaleSync API is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
