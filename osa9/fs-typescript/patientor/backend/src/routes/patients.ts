import express, { type Response } from 'express';

import patientService from '../services/patientService.ts';

import type { NonSensitivePatient, NewPatientEntry } from '../types.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post('/', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newPatientEntry = req.body;
    const addedPatient = patientService.addPatient(newPatientEntry as NewPatientEntry);
    res.json(addedPatient);
});

export default router;