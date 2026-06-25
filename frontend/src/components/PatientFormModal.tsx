import { useEffect, useState } from "react";
import { api } from "../api";
import type { Patient } from "../types";
import { Modal } from "./Modal";
import type { Translation } from "../i18n";

type Props = {
  open: boolean;
  patient?: Patient | null;
  t: Translation;
  onClose: () => void;
  onSaved: (patient?: Patient) => void;
};

export function PatientFormModal({ open, patient, t, onClose, onSaved }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    if (!open) return;

    setFirstName(patient?.first_name ?? "");
    setLastName(patient?.last_name ?? "");
    setBirthDate(patient?.birth_date ?? "");
  }, [open, patient]);

  async function save() {
    const payload = {
      id: patient?.id,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate
    };

    await api("patients.php", {
      method: patient ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });

    onSaved(patient ? { ...patient, ...payload, id: patient.id, account_id: patient.account_id } : undefined);
    onClose();
  }

  return (
    <Modal title={patient ? t.Patient.editPatient : t.Patient.addPatient} open={open} onClose={onClose}>
      <div className="space-y-4">
        <input className="field" placeholder={t.Patient.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input className="field" placeholder={t.Patient.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input className="field" type="date" aria-label={t.Patient.birthDate} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />

        <button onClick={save} className="btn-primary w-full">{t.Common.save}</button>
      </div>
    </Modal>
  );
}