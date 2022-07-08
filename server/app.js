const express = require('express');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/api', routes);

app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: '404 Not Found'
  });
});

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening at ${port}...`));