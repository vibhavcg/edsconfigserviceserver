// tiny helper functions to build URLs, cURL and perform fetch calls.
// The app uses these to GET/POST/PUT/DELETE the site config
export function buildConfigUrl(base, org, site) {
  const trimmedBase = base.replace(/\/+$/, "");
  return `${trimmedBase}/config/${encodeURIComponent(org)}/sites/${encodeURIComponent(site)}.json`;
}

export function buildCurl({ method = "GET", url, body, apiKey, headers = {} }) {
  const hdrs = Object.assign({}, headers);
  if (apiKey) {
    hdrs["Authorization"] = `token ${apiKey}`;
  }
  const headerParts = Object.entries(hdrs).map(([k, v]) => `-H "${k}: ${v}"`).join(" ");
  const dataPart = body ? `--data '${JSON.stringify(body, null, 2)}'` : "";
  return `curl -X ${method} ${headerParts} "${url}" ${dataPart}`.trim();
}

export async function callApi({ method = "GET", url, body, apiKey, extraHeaders = {} }) {
  const headers = Object.assign(
    {
      "Content-Type": "application/json",
    },
    extraHeaders
  );
  if (apiKey) headers["Authorization"] = `token ${apiKey}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    parsed = text;
  }
  return {
    status: res.status,
    ok: res.ok,
    headers: Object.fromEntries(res.headers.entries()),
    body: parsed,
  };
}