# School Management System Frontend

## Environment setup

Firebase configuration is loaded from Vite environment variables. Create a
local environment file from the checked-in template:

```sh
cp .env.example .env
```

Replace the placeholder values in `.env` with the Firebase web app
configuration. Only variables prefixed with `VITE_` are exposed to the
frontend. `.env` and other local environment files are ignored by Git.

## Cloudinary image uploads

Student images use a Cloudinary unsigned upload preset. In Cloudinary, open
**Settings > Upload > Upload presets**, create a preset, set its signing mode
to **Unsigned**, and put its exact name in `.env`:

```sh
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset-name
```

Never add a Cloudinary API secret or API key to frontend environment variables.
Restart Vite after changing `.env`.

The image replacement flow calls the server API to delete the old Cloudinary
asset. Set `VITE_API_URL` to the server URL, for example:

```sh
VITE_API_URL=http://localhost:3000
```

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

## Deletion API server

Create `server/.env` from `server/.env.example`. Add the Cloudinary API
credentials and a Firebase service-account JSON object to that file only.
Never put those values in `Frontend/.env`.

```sh
cd server
npm install
npm run dev
```

The API verifies Firebase ID tokens before deleting a `students/...` image.
