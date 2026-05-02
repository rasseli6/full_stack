interface BmiValues {
    height: number;
    weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
    if (args.length < 4) {
        throw new Error('Not enought arguments');
    }
    if (args.length > 4) {
        throw new Error('Too many arguments');
    }
    const height = Number(args[2]);
    const weight = Number(args[3]);

    if (!isNaN(height) && !isNaN(weight)) {
        return {
            height, 
            weight
        };
    }
    throw new Error('Provided values were not numbers!')
}

export const calculateBmi = (height: number, weight: number): string => {
    const cmToM = height / 100
    const bmi = weight / cmToM ** 2
    
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi <= 24.9) {
        return 'Normal range';
    } else {
        return 'Overweight'
    }
};

if (process.argv[1] === import.meta.filename) {
    try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
    } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
    }
}
