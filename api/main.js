import express from 'express';
import cors from 'cors';
import { getLiveriesMsfsAddons, getLiveriesXplane } from './puppeteerModule.js';

const app = express();
const port = 3000;

app.use(cors());

app.get('/simadds/liveries/msfsAddons', async (req, res) => {
  try {
    const result = await getLiveriesMsfsAddons();
    res.json(result);
  } catch (error) {
    console.error('Error in API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/simadds/liveries/xplane', async (req, res) => {
  try {
    const result = await getLiveriesXplane();
    res.json(result);
  } catch (error) {
    console.error('Error in API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
