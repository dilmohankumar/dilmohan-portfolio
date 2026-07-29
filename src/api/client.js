const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, csrfToken } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json?.error?.message || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return json;
}

// Multipart upload — no Content-Type header so the browser sets the boundary itself.
async function uploadRequest(path, formData, csrfToken) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {},
    credentials: "include",
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json?.error?.message || `Upload failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return json;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, csrfToken) => request(path, { method: "POST", body, csrfToken }),
  patch: (path, body, csrfToken) => request(path, { method: "PATCH", body, csrfToken }),
  del: (path, csrfToken) => request(path, { method: "DELETE", csrfToken }),
  upload: (path, formData, csrfToken) => uploadRequest(path, formData, csrfToken),
};
