import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

type Health = {
  status: string;
  database: string;
};

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl("/health"))
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  const backendOk = health !== null;
  const databaseOk = health?.database === "ok";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Interview Starter
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Next.js (pages router) + FastAPI + Postgres
        </p>

        <ul className="mt-6 space-y-3">
          <StatusRow label="Frontend" ok={true} detail="you're looking at it" />
          <StatusRow
            label="Backend"
            ok={backendOk}
            detail={backendOk ? "connected on :8765" : (error ?? "checking…")}
          />
          <StatusRow
            label="Database"
            ok={databaseOk}
            detail={
              databaseOk
                ? "connected on :6543"
                : (health?.database ?? "waiting for backend…")
            }
          />
        </ul>
      </div>
    </main>
  );
}

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-green-500" : "bg-red-400"}`}
      />
      <span className="w-24 font-medium text-gray-700">{label}</span>
      <span className="text-sm text-gray-500">{detail}</span>
    </li>
  );
}
