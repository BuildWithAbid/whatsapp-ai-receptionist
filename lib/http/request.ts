export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function parseJsonBody<T>(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return {} as T;
  }

  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}
