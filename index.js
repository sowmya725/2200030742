const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { updateWindow, getWindow, getAverage } = require('./windowStore');

const app = express();
const PORT = 9876;

app.use(cors());

const API_URLS = {
  p: 'http://20.244.56.144/evaluation-service/primes',
  f: 'http://20.244.56.144/evaluation-service/fibo',
  e: 'http://20.244.56.144/evaluation-service/even',
  r: 'http://20.244.56.144/evaluation-service/rand',
};

app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id.toLowerCase();

  if (!['p', 'f', 'e', 'r'].includes(id)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const prevState = getWindow();

  try {
    const source = axios.CancelToken.source();

    const timeout = setTimeout(() => {
      source.cancel('Timeout of 500ms exceeded');
    }, 500);

    const response = await axios.get(API_URLS[id], { cancelToken: source.token });

    clearTimeout(timeout);

    const numbers = response.data.numbers || response.data.number || [];

    const updatedWindow = updateWindow(numbers);

    return res.json({
      windowPrevState: prevState,
      windowCurrState: updatedWindow,
      numbers: updatedWindow,
      avg: getAverage(),
    });
  } catch (error) {
    return res.json({
      windowPrevState: prevState,
      windowCurrState: getWindow(),
      numbers: getWindow(),
      avg: getAverage(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});