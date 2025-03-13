import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
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
    origin: 'https://inventrack-kdoa.onrender.com',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
