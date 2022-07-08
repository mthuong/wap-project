const express = require('express');
const path = require('path');
const validateToken = require('./middleware/authentication');
const errorHandler = require('./middleware/errorHandler');
const authRoute = require('./routes/authRoute');
// const productRouter = require('./routes/productRouter');
const app = express();

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/auth', authRoute);
// app.use('/products', validateToken, productRouter);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening at ${port}...`));