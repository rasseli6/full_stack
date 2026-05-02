import { z } from 'zod';
export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}
export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

export type Gender = typeof Gender[keyof typeof Gender];

export type NonSensitivePatient = Omit<Patient, 'ssn'>;
export type NewPatientEntry = z.infer<typeof NewPatientSchema>;