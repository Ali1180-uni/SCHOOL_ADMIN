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

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```
