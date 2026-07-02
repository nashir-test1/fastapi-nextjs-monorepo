import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

type Fruit = {
  name: string;
  color: string;
};

export default function Fruits() {
  const [fruits, setFruits] = useState<Fruit[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl("/fruits"))
      .then((res) => res.json())
      .then(setFruits)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main>
      <h1>Fruits</h1>
      <p>
        Sample rows from the <code>sample_fruits</code> table
      </p>

      {error && <p>Error: {error}</p>}
      {!error && fruits === null && <p>Loading…</p>}
      {fruits && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {fruits.map((fruit) => (
              <tr key={fruit.name}>
                <td>{fruit.name}</td>
                <td>{fruit.color}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>
        <Link href="/">Back home</Link>
      </p>
    </main>
  );
}
