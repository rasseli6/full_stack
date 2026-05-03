import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import patientService from "../../services/patients";

import type { Patient } from "../../types";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);
      }
    };

    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Typography variant="h5">{patient.name}</Typography>
      <p>gender: {patient.gender}</p>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <p>date of birth: {patient.dateOfBirth}</p>

      <Typography variant="h6">entries</Typography>
      {patient.entries.length === 0 && <p>No entries</p>}
    </div>
  );
};

export default PatientPage;