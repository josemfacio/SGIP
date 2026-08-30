const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5190";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("No se pudo conectar con SGIP.Api. Verifica que el backend esté iniciado.");
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(body.message || "La operación no pudo completarse.", response.status);
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}
