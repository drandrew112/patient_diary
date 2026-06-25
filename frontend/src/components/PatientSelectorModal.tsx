import type { Patient } from "../types";
import { Modal } from "./Modal";
import type { Translation } from "../i18n";

type Props = {
  open: boolean;
  patients: Patient[];
  selectedPatient: Patient | null;
  t: Translation;
  onSelect: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
};

export function PatientSelectorModal({
  open,
  patients,
  selectedPatient,
  t,
  onSelect,
  onEdit,
  onDelete,
  onClose
}: Props) {
  return (
    <Modal title={t.Patient.selectPatient} open={open} onClose={onClose}>
      <div className="space-y-3">
        {patients.length === 0 && (
          <p className="text-slate-400">{t.Patient.noPatients}</p>
        )}

        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`rounded-2xl border p-4 ${selectedPatient?.id === patient.id ? "border-sky-400 bg-sky-950/40" : "border-slate-700 bg-slate-950"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onSelect(patient);
                  onClose();
                }}
                className="min-w-0 flex-1 text-left"
              >
                <div className="font-semibold text-sky-100">
                  {patient.last_name} {patient.first_name}
                </div>
                <div className="text-sm text-slate-400">
                  {t.Patient.birthDate}: {patient.birth_date}
                </div>
              </button>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => onEdit(patient)}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-sky-700"
                >
                  {t.Common.edit}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(t.Common.confirmDelete)) onDelete(patient.id);
                  }}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-red-700"
                >
                  {t.Common.delete}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}