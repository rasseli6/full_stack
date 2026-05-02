import { v1 as uuid } from 'uuid';
import patients from '../../data/patients.ts';

import type { NonSensitivePatient, Patient, NewPatientEntry } from '../types.ts';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatientEntry): Patient => {
    const newPatient = {
        id: uuid(),
        ...entry
    };
    patients.push(newPatient);
    return newPatient;
};

export default {
  getNonSensitivePatients,
  addPatient
};