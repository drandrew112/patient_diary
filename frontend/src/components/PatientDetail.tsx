import type { Patient } from "../types";
import { EventLogPanel } from "./EventLogPanel";
import { PatientLogPanel } from "./PatientLogPanel";
import type { Translation } from "../i18n";

type Props = {
  t: Translation;
  patient: Patient | null;
};

export function PatientDetail({ t, patient }: Props) {
  if (!patient) {
    return (
      <main className="card flex min-h-72 items-center justify-center text-slate-400">
        {t.Patient.selectPatient}
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-skysoft">
          {patient.last_name} {patient.first_name}
        </h2>
        <p className="text-slate-400">{patient.birth_date}</p>
      </div>

      <PatientLogPanel t={t} patient={patient} />
      <EventLogPanel t={t} patient={patient} />
    </main>
  );
}