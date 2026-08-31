"use client";

import { useState, type FormEvent } from "react";
import { useUsers } from "@/features/users/context/UserProvider";
import { formatCurrency } from "@/lib/formatters";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function UsersPage() {
  const { users, activeUser, loading, error: loadError, createUser, selectUser } = useUsers();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createUser({ name, email, monthlyIncome: Number(monthlyIncome) });
      setName("");
      setEmail("");
      setMonthlyIncome("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo crear el usuario");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <form
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={submit}
      >
        <h2 className="text-base font-extrabold text-slate-900">Nuevo usuario</h2>
        <label className="mt-5 grid gap-2 text-xs font-bold text-slate-600">
          Nombre completo
          <input
            className={inputClass}
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
          Correo electrónico
          <input
            className={inputClass}
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="mt-4 grid gap-2 text-xs font-bold text-slate-600">
          Ingreso mensual
          <input
            className={inputClass}
            required
            type="number"
            min="1"
            step="0.01"
            value={monthlyIncome}
            onChange={(event) => setMonthlyIncome(event.target.value)}
          />
        </label>
        {(error || loadError) && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error || loadError}</p>
        )}
        <button
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Creando..." : "Crear y seleccionar"}
        </button>
      </form>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-sm font-bold text-slate-900">Usuarios registrados</h2>
          <p className="text-xs text-slate-400">{users.length} clientes disponibles</p>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Cargando usuarios...</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((user) => {
              const selected = activeUser?.userId === user.userId;
              return (
                <button
                  key={user.userId}
                  type="button"
                  onClick={() => selectUser(user.userId)}
                  className={`flex w-full items-center gap-4 p-5 text-left hover:bg-slate-50 ${selected ? "bg-blue-50" : ""}`}
                >
                  <span className="grid size-10 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">
                    {user.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="grid min-w-0 flex-1">
                    <strong className="truncate text-sm text-slate-800">{user.name}</strong>
                    <small className="truncate text-slate-400">{user.email}</small>
                  </span>
                  <span className="text-right">
                    <strong className="block text-sm text-slate-700">
                      {formatCurrency(user.monthlyIncome)}
                    </strong>
                    <small className={selected ? "font-bold text-blue-600" : "text-slate-400"}>
                      {selected ? "Seleccionado" : "Seleccionar"}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
