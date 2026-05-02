interface ExerciseValues {
    target: number;
    dailyHours: number[];
}
const parseArguments = (args: string[]): ExerciseValues => {
    if (args.length < 4) {
        throw new Error('Not enought arguments');
    }
    const target = Number(args[2]);
    const dailyHours = args.slice(3).map(hour => Number(hour));
    if (!isNaN(target) && dailyHours.every(hour => !isNaN(hour))) {
        return {
            target,
            dailyHours
        };
    }
    throw new Error('Provided values were not numbers!');
};
interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(hours => hours > 0).length;
    const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
    const average = totalHours / periodLength;
    const success = average >= target;
    let rating: number;
    let ratingDescription: string;
    if (average >= target){
        rating = 3;
        ratingDescription = 'great job';
    }
    else if (average >= target * 0.75){
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    }
    else {
        rating = 1; 
        ratingDescription = 'you need to work harder';
    }
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average,
    };
};

if (process.argv[1] === import.meta.filename){
    try {
        const { target, dailyHours } = parseArguments(process.argv);
        console.log(calculateExercises(dailyHours, target));
    } catch (error: unknown) {
        let errorMessage = 'Something bad happened.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        console.log(errorMessage);
    }
}
