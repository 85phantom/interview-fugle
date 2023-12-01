import express from 'express';
import errorHandler from './middleware/errorhandler';
import { getDivisibleNumbers } from './divisible_numbers';
import rateLimit from './middleware/rateLimit';
const app = express();
const port = 3000;

app.get('/data', rateLimit(), getDivisibleNumbers);
app.use(errorHandler());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
