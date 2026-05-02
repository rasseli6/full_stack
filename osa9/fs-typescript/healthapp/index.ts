import express from 'express';

const app = express();

app.get('/hello', (_req, res) => {
    res.send('Hello Full stack!');
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on por ${PORT}`)
});