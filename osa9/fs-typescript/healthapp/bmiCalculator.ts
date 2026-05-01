const calculateBmi = (height: number, weight: number): string => {
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
console.log(calculateBmi(180, 74))