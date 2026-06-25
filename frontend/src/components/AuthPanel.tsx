import { useState } from "react";
import { api } from "../api";
import type { Account } from "../types";
import type { Translation } from "../i18n";

type Props = {
  t: Translation;
  onLogin: (account: Account) => void;
};

export function AuthPanel({ t, onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const data = await api<{ success: boolean; account: Account }>("login.php", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    onLogin(data.account);
  }

  async function register() {
    await api<{ success: boolean }>("register.php", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    await login();
  }

  return (
    <section className="card mx-auto max-w-md">
      <h1 className="mb-6 text-3xl font-bold text-skysoft">{t.Common.appName}</h1>

      <div className="space-y-4">
        <input className="input" placeholder={t.Auth.email} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder={t.Auth.password} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="flex gap-3">
          <button className="btn-primary" onClick={login}>{t.Auth.login}</button>
          <button className="btn-orange" onClick={register}>{t.Auth.register}</button>
        </div>
      </div>
    </section>
  );
}