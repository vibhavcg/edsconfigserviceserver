import React, { useState } from "react";
import { buildConfigUrl, buildCurl, callApi } from "./api";
import collectionTemplate from "./postmanCollection.json";

const defaultBase = import.meta.env.VITE_API_BASE || "https://admin.hlx.page";
const defaultApiKey = import.meta.env.VITE_API_KEY || "";
const defaultOrg = import.meta.env.VITE_DEFAULT_ORG || "adobe";
const defaultSite = import.meta.env.VITE_DEFAULT_SITE || "blog";

export default function App() {
  const [baseUrl, setBaseUrl] = useState(defaultBase);
  const [apiKey, setApiKey] = useState(defaultApiKey);
  const [org, setOrg] = useState(defaultOrg);
  const [site, setSite] = useState(defaultSite);
  const [payload, setPayload] = useState(`{
  "title": "Example site config",
  "description": "Created via EDS UI"
}`);
  const [result, setResult] = useState(null);

  const url = buildConfigUrl(baseUrl, org, site);

  async function onCall(method) {
    let body = null;
    if (method === "POST" || method === "PUT") {
      try {
        body = JSON.parse(payload);
      } catch (e) {
        setResult({ error: "Invalid JSON payload" });
        return;
      }
    }
    setResult({ loading: true });
    try {
      const res = await callApi({ method, url, body, apiKey });
      setResult(res);
    } catch (e) {
      setResult({ error: String(e) });
    }
  }

  function onCopyCurl(method) {
    const body = (method === "POST" || method === "PUT") ? JSON.parseSafe?.(payload) ?? (() => { try { return JSON.parse(payload); } catch(e) { return null; }})() : null;
    const c = buildCurl({ method, url, body, apiKey });
    navigator.clipboard?.writeText(c);
    alert("cURL copied to clipboard");
  }

  function downloadCollection() {
    // clone and replace variables in the template to reflect current settings
    const coll = JSON.parse(JSON.stringify(collectionTemplate));
    // set initial values of variables to current UI values
    const vars = coll.variable || [];
    const updateVar = (key, value) => {
      const v = vars.find((x) => x.key === key);
      if (v) v.value = value;
      else vars.push({ key, value });
    };
    updateVar("baseUrl", baseUrl);
    updateVar("org", org);
    updateVar("site", site);
    updateVar("apiKey", apiKey || "");
    coll.variable = vars;

    const blob = new Blob([JSON.stringify(coll, null, 2)], { type: "application/json" });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = `edsconfigserviceserver-postman-collection.json`;
    a.click();
    URL.revokeObjectURL(urlBlob);
  }

  return (
    <div className="container">
      <h2>EDS Config Service — Site Config CRUD</h2>

      <div className="row">
        <label style={{ width: 90 }}>Base URL</label>
        <input className="input" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
      </div>

      <div className="row">
        <label style={{ width: 90 }}>API Key</label>
        <input className="input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="optional (token ...)" />
      </div>

      <div className="row">
        <label style={{ width: 90 }}>Org</label>
        <input className="input" value={org} onChange={(e) => setOrg(e.target.value)} />
        <label style={{ width: 70 }}>Site</label>
        <input className="input" value={site} onChange={(e) => setSite(e.target.value)} />
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Target URL:</strong>
        <div className="pre" style={{ marginTop: 8 }}>{url}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <textarea
          rows={8}
          className="input"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          aria-label="payload"
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn btn-primary" onClick={() => onCall("GET")}>GET (view)</button>
        <button className="btn btn-ghost" onClick={() => onCall("POST")}>POST (update)</button>
        <button className="btn btn-ghost" onClick={() => onCall("PUT")}>PUT (create)</button>
        <button className="btn btn-ghost" onClick={() => onCall("DELETE")}>DELETE</button>

        <button className="btn" onClick={() => { navigator.clipboard?.writeText(buildCurl({ method: "GET", url, apiKey })); alert("GET cURL copied"); }}>Copy GET cURL</button>
        <button className="btn" onClick={() => { navigator.clipboard?.writeText(buildCurl({ method: "POST", url, apiKey, body: JSON.parseSafe?.(payload) ?? (() => { try { return JSON.parse(payload); } catch(e) { return null;} })()})); alert("POST cURL copied"); }}>Copy POST cURL</button>

        <button className="btn btn-primary" onClick={downloadCollection}>Download Postman Collection</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Result</h3>
        <pre className="pre">{result ? JSON.stringify(result, null, 2) : "No result yet"}</pre>
      </div>

      <div style={{ marginTop: 16 }}>
        <small>
          The "Download Postman Collection" contains the four CRUD requests and uses collection variables:
          baseUrl, org, site, apiKey. You can import that collection into Postman and use the included environment variables.
        </small>
      </div>
    </div>
  );
}