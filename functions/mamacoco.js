export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Get "?=https://example.com"
  const target = url.searchParams.get("");

  if (!target) {
    return new Response("Missing URL", { status: 400 });
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  const response = await fetch(targetUrl.toString(), {
    headers: {
      "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
    },
  });

  const headers = new Headers(response.headers);

  // Remove iframe blockers
  headers.delete("x-frame-options");
  headers.delete("content-security-policy");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

