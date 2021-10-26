import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import postRoutes from './routes/posts.js';
import userRouter from './routes/user.js';
dotenv.config();
const app = express();

app.use(cors());
//localhost:5000/posts

//general middleware setup
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use('/posts', postRoutes);
app.use('/user', userRouter);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get(`*`, (req, res) => {
    res.sendFile(path.resolve(__dirname, `client`, `build`, `index.html`));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}
const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.MONGO_URI;

//connect to mongodb db
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));