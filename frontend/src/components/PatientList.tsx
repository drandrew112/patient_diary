import { useState } from "react";
import { api } from "../api";
import type { Patient } from "../types";
import type { Translation } from "../i18n";

type Props = {
  t: Translation;
  patients: Patient[];
  selectedPatientId: number | null;
  onSelect: (patient: Patient) => void;
  onChange: () => Promise<void>;
};

export function PatientList({ t, patients, selectedPatientId, onSelect, onChange }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  async function addPatient() {
    await api<{ success: boolean }>("patients.php", {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate
      })
    });

    setFirstName("");
    setLastName("");
    setBirthDate("");
    await onChange();
  }

  async function deletePatient(id: number) {
    await api<{ success: boolean }>(`patients.php?id=${id}`, { method: "DELETE" });
    await onChange();
  }

  return (
    <aside className="card">
      <h2 className="mb-4 text-xl font-bold text-skysoft">{t.Patient.patients}</h2>

      <div className="mb-6 space-y-3">
        <input className="input" placeholder={t.Patient.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input className="input" placeholder={t.Patient.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input className="input" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        <button className="btn-orange w-full" onClick={addPatient}>{t.Patient.addPatient}</button>
      </div>

      <div className="space-y-2">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`rounded-xl border p-3 ${selectedPatientId === patient.id ? "border-skysoft bg-skysoft/10" : "border-slate-700 bg-panel2"}`}
          >
            <button className="block w-full text-left" onClick={() => onSelect(patient)}>
              <div className="font-semibold">{patient.last_name} {patient.first_name}</div>
              <div className="text-sm text-slate-400">{patient.birth_date}</div>
            </button>

            <button className="mt-2 text-sm text-orangehot hover:underline" onClick={() => deletePatient(patient.id)}>
              {t.Common.delete}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}