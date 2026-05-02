interface ExerciseResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
    const periodLength = dailyHours.length
    const trainingDays = dailyHours.filter(hours => hours > 0).length
    const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0)
    const average = totalHours / periodLength
    const success = average >= target;
    let rating: number;
    let ratingDescription: string;
    if (average >= target){
        rating = 3
        ratingDescription = 'great job'
    }
    else if (average >= target * 0.75){
        rating = 2
        ratingDescription = 'not too bad but could be better'
    }
    else {
        rating = 1 
        ratingDescription = 'you need to work harder'
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
console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));