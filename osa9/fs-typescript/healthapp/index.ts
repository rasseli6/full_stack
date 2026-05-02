import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';

const app = express();

app.get('/hello', (_req, res) => {
    res.send('Hello Full stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if(isNaN(height) || isNaN(weight)) {
        res.status(400).json({
            error: 'malformatted parameters'
        });
        return;
    }
    
    const bmi = calculateBmi(height, weight);
    res.json({
        weight,
        height,
        bmi,
    });
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on por ${PORT}`);
});