import express from 'express';

import errorHandler from './middleware/errorhandler';
const app = express();
const port = 3000;

app.use(errorHandler());
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
