import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';

// Creacion del app
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', userRoutes);
app.use('/restaurant', restaurantRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});

// Conexión a MongoDB usando mongoose
mongoose
    .connect(
        'mongodb+srv://' +
        process.env.MONGO_USER +
        ':' +
        process.env.MONGO_PASS +
        '@cluster0.i7ggasq.mongodb.net/?retryWrites=true&w=majority',
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    )
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.log('There was an error with connection!');
        console.log(err);
    });