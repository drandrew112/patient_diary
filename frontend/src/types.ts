export type Account = {
  id: number;
  email: string;
};

export type Patient = {
  id: number;
  account_id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
};

export type PatientLog = {
  id: number;
  patient_id: number;
  created_at: string;
  ab_oxysat: number | null;
  c_pulse: number | null;
  c_bp_left_sis: number | null;
  c_bp_left_dis: number | null;
  c_bp_right_sis: number | null;
  c_bp_right_dis: number | null;
  notes: string | null;
};

export type EventLog = {
  id: number;
  patient_id: number;
  created_at: string;
  text: string;
  files: EventFile[];
};

export type EventFile = {
  path: string;
  name: string;
  displayName: string;
};
