import express from 'express';
import cors from 'cors'; // Import CORS middleware
import cookieParser from 'cookie-parser'; // Import cookies-parser middleware
import 'dotenv/config'; // Make sure to load environment variables
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";

const app = express();

const port = process.env.PORT || 3001;
const corsOptions = {
    origin: 'http://localhost:3000', // Allow only your frontend URL
    credentials: true, // Allow cookies to be sent with requests
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS for all routes with credentials
app.use(express.json({ limit: '50mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.get('/', (req, res) => {
    res.send(`Our server is running on port ${port}`);
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/customer', customerRoutes);
app.use('/category', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/analytics', analyticRoutes);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});