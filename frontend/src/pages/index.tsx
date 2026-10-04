import Link from "next/link";
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
    <main>
      <h1>Interview Starter</h1>
      <p>Next.js (pages router) + FastAPI + Postgres</p>
      <ul>
        <li>Frontend: ok</li>
        <li>
          Backend:{" "}
          {backendOk ? "ok (port 8765)" : (error ?? "checking…")}
        </li>
        <li>
          Database:{" "}
          {databaseOk
            ? "ok (port 6543)"
            : (health?.database ?? "waiting for backend…")}
        </li>
      </ul>
      <Link href="/fruits">Sample page: fruits from the database</Link>
    </main>
  );
}

// NAS-112 frontend affected-push acceptance 2026-10-05
