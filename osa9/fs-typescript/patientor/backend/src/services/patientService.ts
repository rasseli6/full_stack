import { v1 as uuid } from 'uuid';
import patients from '../../data/patients.ts';

import type { NonSensitivePatient, 
  Patient, 
  NewPatientEntry,
  NewEntry, 
  Entry
 } from '../types.ts';

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
        ...entry,
        entries: [],
    };
    patients.push(newPatient);
    return newPatient;
};

const findById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getNonSensitivePatients,
  addPatient,
  findById,
  addEntry,
};