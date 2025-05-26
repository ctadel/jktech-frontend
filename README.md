# ctadel-library (Frontend)

This is the frontend for the **Ctadel Library** project – an AI-powered document ingestion and querying platform. It integrates with the FastAPI backend and offers an interactive, user-friendly interface built in Angular.

## 🌐 Live Backend API
- Backend GitHub: [ctadel-library-backend](https://github.com/ctadel/jktech-backend)
- Swagger Docs: `/docs` (hosted on backend)

---

## 🛠️ Features

- **Explore Page**: Lists all documents by categories like Latest, Trending, Most Starred, and Most Queried. Users can start querying directly (if logged in).
- **Conversation Page**: Similar to ChatGPT, lets users query documents or general questions. Supports listing past conversations in a side panel.
- **Document Ingestion**: Users can upload documents (e.g., ebooks, movies) directly within the conversation UI.
- **Auth Pages**: Combined Login/Register UI at `/auth` with JWT-based session auth.
- **Superadmin Dashboard**: Admins and moderators can manage users and documents.

## 📊 Tech Stack

- **Angular**: 19.2.13
- **Node & NPM**: Use latest stable versions
- **Auth**: Session-based JWT
- **Guards**: Angular AuthGuard protects routes

---

## 🚀 Getting Started

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
ng serve --configuration=development
```

### Production Build

```bash
# Ensure environment.production.ts is updated
ng serve --configuration=production
```

### Running Tests

```bash
ng test
```

## 📁 Folder Structure Overview

```bash
src/
├── app/
│   ├── _guards/            # Route guards (auth.guard.ts)
│   ├── _helpers/           # HTTP interceptors
│   ├── _services/          # API, Auth, Conversation, Storage services
│   ├── _shared/            # Reusable components (Document cards, Data tables)
│   ├── auth/               # AuthComponent
│   ├── board-admin/        # Admin dashboard
│   ├── board-user/         # User dashboard
│   ├── homepage/           # Temporary Landing page
│   ├── home/               # Main UI layout
│   ├── profile/            # User profile
│   ├── models/             # TypeScript models
│   └── app.module.ts       # Main module
├── environments/           # Environment configs
├── assets/                 # Static assets
├── main.ts                 # Entry point
└── styles.css              # Global styles
```

---

## 🐳 Docker

```bash
# Build Docker image
docker build -t ctadel-frontend .

# Run Docker container
docker run -d -p 4200:80 ctadel-frontend
```

> Optionally, add nginx for optimized production builds.

---

## 🚀 Deployment & CI/CD Approach

### Suggested Stack for Production

- **Build Tool**: Use Angular CLI or GitHub Actions to create optimized production builds.
- **Web Server**: Serve static files using Nginx or a CDN (e.g., Cloudflare).
- **Hosting Platforms**: Netlify, Vercel, AWS Amplify, Firebase Hosting, or custom Nginx server.

### CI/CD Suggestions

- **GitHub Actions / GitLab CI**:
  - Linting and testing on PRs
  - Auto-build and deploy on push to `main`
  - Version tagging for releases

- **Dockerized Pipeline**:
  - Build Angular app in CI
  - Serve via multi-stage Dockerfile (builder → nginx)

- **Security & Monitoring**:
  - Add security headers in Nginx
  - Monitor logs via a logging service (e.g., LogRocket/Sentry)

---

## ✅ Environment Configuration

Update `src/environments/environment.ts` and `environment.development.ts` as needed:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api/v1' // Backend URL
};
```

---

## 👤 Author

Maintained by [ctadel](https://github.com/ctadel)

---

## ✉️ License

MIT License (or specify your preferred license)

---

## ✨ Example Use Cases

* Upload a research paper or college books and ask crazy
* Upload a movie script and generate a character map
* Star/Bookmark useful documents
* View and archive past conversations

---
