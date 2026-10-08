import type { NextApiRequest, NextApiResponse } from "next";

const ALLOWED_METHODS = new Set(["GET", "HEAD"]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.method || !ALLOWED_METHODS.has(req.method)) {
    res.setHeader("Allow", [...ALLOWED_METHODS]);
    return res.status(405).json({ detail: "Method not allowed" });
  }

  const backendUrl = process.env.API_URL;
  if (!backendUrl) {
    return res.status(503).json({ detail: "Backend service is not configured" });
  }

  const path = Array.isArray(req.query.path) ? req.query.path : [];

  try {
    const target = new URL(
      path.map(encodeURIComponent).join("/"),
      `${backendUrl.replace(/\/$/, "")}/`,
    );
    const upstream = await fetch(target, {
      method: req.method,
      headers: { accept: req.headers.accept ?? "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status);
    res.setHeader("Cache-Control", "no-store");
    const contentType = upstream.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    return res.send(body);
  } catch {
    return res.status(502).json({ detail: "Backend service is unavailable" });
  }
}
