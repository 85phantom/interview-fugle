import express from 'express';
import errorHandler from './middleware/errorhandler';
import { getDivisibleNumbers } from './divisible_numbers';
const app = express();
const port = 3000;

app.get('/data', getDivisibleNumbers);
app.use(errorHandler());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
