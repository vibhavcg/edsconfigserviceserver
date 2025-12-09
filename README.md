```markdown
# edsconfigserviceserver — Site Config UI & Postman export

This small React module provides a simple UI to create / view / update / delete site config
resources via the Admin API, plus the ability to copy cURL commands and to download a full Postman
collection and environment file.

Quick start (inside `edsconfigserviceserver` folder):

1. Copy `.env.example` to `.env` and set VITE_API_BASE and VITE_API_KEY if needed.
2. Install dependencies:
   - npm install
3. Run dev server:
   - npm run dev
4. Open http://localhost:5173

What it contains:
- A minimal React UI that:
  - builds the target URL for /config/{org}/sites/{site}.json
  - allows editing a JSON payload
  - runs GET, POST (update), PUT (create) and DELETE operations
  - copies cURL for quick CLI testing
  - downloads a Postman Collection JSON containing the four CRUD requests and collection variables
- A Postman environment JSON that defines variables baseUrl, org, site and apiKey.

Postman:
- Import the `postman/collection.json` into Postman.
- Import the `postman/environment.json` as an environment and set your apiKey there.

Notes:
- This sample focuses on the site config endpoints: GET /config/{org}/sites/{site}.json,
  POST /config/{org}/sites/{site}.json, PUT /config/{org}/sites/{site}.json and DELETE /config/{org}/sites/{site}.json.
- The React app demonstrates how to build requests and export a Postman collection.
- You can extend the included Postman collection (src/postmanCollection.json) to include other endpoints from your OpenAPI spec.
