# Razorpay-VSS – Full Stack Application (GCP)

A full-stack application with **Vite frontend**, **Node.js backend**, **PostgreSQL**, and **Razorpay integration**, deployed on **Google Cloud Platform** using **Cloud Run**, **Firebase Hosting**, and **Cloud Build CI/CD**.

---

## 🔹 Project Overview

- Frontend hosted on **Firebase Hosting**
- Backend deployed on **Cloud Run**
- Database on **Cloud SQL (PostgreSQL)**
- Dockerized backend
- CI/CD implemented using **Cloud Build**
- Manual deployment upgraded to automated pipeline

---

## 🧱 Architecture (High Level)

```
Firebase Hosting (Frontend)
        ↓
Cloud Run (Node.js Backend)
        ↓
Cloud SQL (PostgreSQL)
```

---

## 📁 Repository Structure

```
RazorpayVss/
├── frontend/        # Vite frontend
├── backend/         # Node.js backend (Dockerized)
│   ├── routes/
│   ├── server.js
│   └── Dockerfile
├── cloudbuild.yaml
└── README.md
```

---

## 🔁 CI/CD Flow (Cloud Build)

1. Code pushed to repository
2. Cloud Build:
   - Builds Docker image
   - Pushes image to registry
   - Deploys to the **same Cloud Run service**
3. Cloud Run creates a new revision (no conflict)
4. Traffic automatically switches to latest revision

---

## 🛠 Tech Stack

- **Frontend:** Vite, JavaScript, Axios, Firebase Hosting
- **Backend:** Node.js, Express, Razorpay API
- **Database:** PostgreSQL (Cloud SQL)
- **DevOps:** Docker, Cloud Run, Cloud Build, Firebase

---

## ✅ Key Highlights

- End-to-end deployment on GCP
- CI/CD without downtime using Cloud Run revisions
- Environment-based configuration
- Hands-on debugging of API routing and database schema issues

---

## 👤 Author

**Veera Venkata Durga Manikanta Nandyala**  
DevOps Engineer

