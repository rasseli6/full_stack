import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";

import patientService from "../../services/patients";

import type { Diagnosis, Entry, NewEntry, Patient } from "../../types";

const healthCheckRatingOptions = [
  { value: 0, label: "0 — Healthy" },
  { value: 1, label: "1 — Low Risk" },
  { value: 2, label: "2 — High Risk" },
  { value: 3, label: "3 — Critical Risk" },
];

interface PatientPageProps {
  diagnoses: Diagnosis[];
}

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const DiagnosisCodes = ({ entry, diagnoses }: EntryDetailsProps) => {
  if (!entry.diagnosisCodes) {
    return null;
  }

  return (
    <ul>
      {entry.diagnosisCodes.map((code) => {
        const diagnosis = diagnoses.find((d) => d.code === code);

        return (
          <li key={code}>
            {code} {diagnosis?.name}
          </li>
        );
      })}
    </ul>
  );
};

const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {
  const baseDetails = (
    <>
      <p>
        <strong>{entry.date}</strong> <em>{entry.description}</em>
      </p>
      <DiagnosisCodes entry={entry} diagnoses={diagnoses} />
      <p>diagnose by {entry.specialist}</p>
    </>
  );

  switch (entry.type) {
    case "Hospital":
      return (
        <div style={{ border: "1px solid black", padding: "0.5em", marginBottom: "0.5em" }}>
          {baseDetails}
          <p>
            discharge: {entry.discharge.date}, {entry.discharge.criteria}
          </p>
        </div>
      );

    case "OccupationalHealthcare":
      return (
        <div style={{ border: "1px solid black", padding: "0.5em", marginBottom: "0.5em" }}>
          <p>
            <strong>{entry.date}</strong> <em>{entry.employerName}</em>
          </p>
          <p>
            <em>{entry.description}</em>
          </p>
          <DiagnosisCodes entry={entry} diagnoses={diagnoses} />
          {entry.sickLeave && (
            <p>
              sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </p>
          )}
          <p>diagnose by {entry.specialist}</p>
        </div>
      );

    case "HealthCheck":
      return (
        <div style={{ border: "1px solid black", padding: "0.5em", marginBottom: "0.5em" }}>
          {baseDetails}
          <p>health check rating: {entry.healthCheckRating}</p>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

const PatientPage = ({ diagnoses }: PatientPageProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string>();
  const [showEntryForm, setShowEntryForm] = useState(false);

  const [entryType, setEntryType] = useState<Entry["type"]>("HealthCheck");

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("0");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

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

  const handleDiagnosisCodeChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;

    setDiagnosisCodes(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const resetForm = () => {
    setEntryType("HealthCheck");
    setDate("");
    setDescription("");
    setSpecialist("");
    setHealthCheckRating("0");
    setDiagnosisCodes([]);
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStartDate("");
    setSickLeaveEndDate("");
    setError(undefined);
    setShowEntryForm(false);
  };

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!patient) {
      return;
    }

    const baseEntry = {
      date,
      description,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    let newEntry: NewEntry;

    switch (entryType) {
      case "HealthCheck":
        newEntry = {
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating: Number(healthCheckRating),
        };
        break;

      case "Hospital":
        newEntry = {
          ...baseEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;

      case "OccupationalHealthcare":
        newEntry = {
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave:
            sickLeaveStartDate && sickLeaveEndDate
              ? {
                  startDate: sickLeaveStartDate,
                  endDate: sickLeaveEndDate,
                }
              : undefined,
        };
        break;

      default:
        return assertNever(entryType);
    }

    try {
      const addedEntry = await patientService.addEntry(patient.id, newEntry);

      setPatient({
        ...patient,
        entries: patient.entries.concat(addedEntry),
      });

      resetForm();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const data = e.response?.data;

        if (
          data &&
          typeof data === "object" &&
          "error" in data &&
          Array.isArray(data.error)
        ) {
          setError(
            data.error
              .map((issue: unknown) => {
                if (
                  issue &&
                  typeof issue === "object" &&
                  "path" in issue &&
                  "message" in issue
                ) {
                  return `${String(issue.path)}: ${String(issue.message)}`;
                }

                return String(issue);
              })
              .join(", ")
          );
        } else {
          setError(e.message);
        }
      } else {
        setError("Unknown error");
      }
    }
  };

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

    {!showEntryForm && (
      <Button
        variant="contained"
        onClick={() => setShowEntryForm(true)}
        sx={{ marginBottom: "1em" }}
      >
        Add New Entry
      </Button>
    )}

    {showEntryForm && (
      <div style={{ border: "1px dashed black", padding: "1em", marginBottom: "1em" }}>
        <Typography variant="h6">New Entry</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={addEntry}>
          <TextField
            select
            label="Entry type"
            value={entryType}
            onChange={(event) => setEntryType(event.target.value as Entry["type"])}
            fullWidth
            margin="dense"
            SelectProps={{
              native: true,
            }}
          >
            <option value="HealthCheck">Health Check</option>
            <option value="OccupationalHealthcare">Occupational Healthcare</option>
            <option value="Hospital">Hospital</option>
          </TextField>

          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Specialist"
            value={specialist}
            onChange={(event) => setSpecialist(event.target.value)}
            fullWidth
            margin="dense"
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
            <Select<string[]>
              labelId="diagnosis-codes-label"
              multiple
              value={diagnosisCodes}
              onChange={handleDiagnosisCodeChange}
              input={<OutlinedInput label="Diagnosis codes" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {diagnoses.map((diagnosis) => (
                <MenuItem key={diagnosis.code} value={diagnosis.code}>
                  <Checkbox checked={diagnosisCodes.includes(diagnosis.code)} />
                  <ListItemText primary={`${diagnosis.code} — ${diagnosis.name}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {entryType === "HealthCheck" && (
            <TextField
              select
              label="Health Check Rating"
              value={healthCheckRating}
              onChange={(event) => setHealthCheckRating(event.target.value)}
              fullWidth
              margin="dense"
            >
              {healthCheckRatingOptions.map((option) => (
                <MenuItem key={option.value} value={String(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}

          {entryType === "Hospital" && (
            <>
              <TextField
                label="Discharge date"
                type="date"
                value={dischargeDate}
                onChange={(event) => setDischargeDate(event.target.value)}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Discharge criteria"
                value={dischargeCriteria}
                onChange={(event) => setDischargeCriteria(event.target.value)}
                fullWidth
                margin="dense"
              />
            </>
          )}

          {entryType === "OccupationalHealthcare" && (
            <>
              <TextField
                label="Employer name"
                value={employerName}
                onChange={(event) => setEmployerName(event.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Sick leave start date"
                type="date"
                value={sickLeaveStartDate}
                onChange={(event) => setSickLeaveStartDate(event.target.value)}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Sick leave end date"
                type="date"
                value={sickLeaveEndDate}
                onChange={(event) => setSickLeaveEndDate(event.target.value)}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}

          <Button type="submit" variant="contained">
            Add
          </Button>
        </form>
      </div>
    )}

    <Typography variant="h6">entries</Typography>
    {patient.entries.length === 0 && <p>No entries</p>}
    {patient.entries.map((entry) => (
      <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
    ))}
  </div>
);
};

export default PatientPage;