import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();

app.use(express.json());

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

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !target) {
        res.status(400).json({
            error: 'parameters missing',
        });
        return;
    }

    if (
        !Array.isArray(daily_exercises) ||
        typeof target !== 'number' ||
        daily_exercises.some(exercise => typeof exercise !== 'number')
    ) {
        res.status(400).json({
            error: 'malformatted parameters'
        });
        return;
    }

    const result = calculateExercises(daily_exercises as number[], target);

    res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on por ${PORT}`);
});