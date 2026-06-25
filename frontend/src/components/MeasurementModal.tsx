import { useEffect, useState } from "react";
import { api } from "../api";
import type { Patient, PatientLog } from "../types";
import { normalizeDateTimeForMysql, nowForDatetimeLocal, toDatetimeLocal } from "../utils";
import { Modal } from "./Modal";
import type { Translation } from "../i18n";

type Props = {
  open: boolean;
  patient: Patient | null;
  log?: PatientLog | null;
  t: Translation;
  onClose: () => void;
  onSaved: () => void;
};

const emptyForm = {
  ab_oxysat: "",
  c_pulse: "",
  c_bp_left_sis: "",
  c_bp_left_dis: "",
  c_bp_right_sis: "",
  c_bp_right_dis: "",
  notes: ""
};

export function MeasurementModal({ open, patient, log, t, onClose, onSaved }: Props) {
  const [createdAt, setCreatedAt] = useState(nowForDatetimeLocal());
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    setCreatedAt(log ? toDatetimeLocal(log.created_at) : nowForDatetimeLocal());
    setForm({
      ab_oxysat: String(log?.ab_oxysat ?? ""),
      c_pulse: String(log?.c_pulse ?? ""),
      c_bp_left_sis: String(log?.c_bp_left_sis ?? ""),
      c_bp_left_dis: String(log?.c_bp_left_dis ?? ""),
      c_bp_right_sis: String(log?.c_bp_right_sis ?? ""),
      c_bp_right_dis: String(log?.c_bp_right_dis ?? ""),
      notes: log?.notes ?? ""
    });
  }, [open, log]);

  async function save() {
    if (!patient) return;

    await api("patient_log.php", {
      method: log ? "PUT" : "POST",
      body: JSON.stringify({
        id: log?.id,
        patient_id: patient.id,
        created_at: normalizeDateTimeForMysql(createdAt),
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) => [key, value === "" ? null : value])
        )
      })
    });

    onSaved();
    onClose();
  }

  return (
    <Modal title={log ? t.Measurement.edit : t.Measurement.add} open={open} onClose={onClose}>
      <div className="grid gap-4">
        <label className="text-sm font-semibold text-slate-300">
          {t.Measurement.date}
          <input className="field mt-2" type="datetime-local" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <input className="field" placeholder={t.Measurement.oxygenSaturation} value={form.ab_oxysat} onChange={(e) => setForm({ ...form, ab_oxysat: e.target.value })} />
          <input className="field" placeholder={t.Measurement.pulse} value={form.c_pulse} onChange={(e) => setForm({ ...form, c_pulse: e.target.value })} />
          <input className="field" placeholder={t.Measurement.bloodPressure.leftSystolic} value={form.c_bp_left_sis} onChange={(e) => setForm({ ...form, c_bp_left_sis: e.target.value })} />
          <input className="field" placeholder={t.Measurement.bloodPressure.rightSystolic} value={form.c_bp_right_sis} onChange={(e) => setForm({ ...form, c_bp_right_sis: e.target.value })} />
          <input className="field" placeholder={t.Measurement.bloodPressure.rightDiastolic} value={form.c_bp_right_dis} onChange={(e) => setForm({ ...form, c_bp_right_dis: e.target.value })} />
          <input className="field" placeholder={t.Measurement.bloodPressure.leftDiastolic} value={form.c_bp_left_dis} onChange={(e) => setForm({ ...form, c_bp_left_dis: e.target.value })} />
        </div>

        <textarea className="field min-h-28" placeholder={t.Measurement.notes} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

        <button onClick={save} className="btn-primary">{t.Common.save}</button>
      </div>
    </Modal>
  );
}