# Document Expiry Manager

A React + Vite web application designated for tracking and managing expiring documents. This project includes an authentication flow, centralized dashboards, and calendar management visualizations to keep track of your most important document dates.

## 🚀 Quick Start Guide

Follow these steps to successfully set up and run the project locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js)

### 2. Installation
First, open your terminal, navigate to the `document-expiry-manager` directory, and install all requisite dependencies:
```bash
npm install
```

> [!NOTE]
> We recently adjusted the `package.json` to leverage cross-platform npm commands and universal tailwind node packages (`@tailwindcss/node`), resolving Windows specific `EBADPLATFORM` errors on Linux systems.

### 3. Environment Setup & WhatsApp Config (Twilio)
Copy the `.env.example` (or edit the `.env` directly) and insert your own third-party credentials. To enable the WhatsApp reminder system, you must connect a Twilio account:

1. Register at Twilio and copy your **Account SID** and **Auth Token**.
2. Activate the **Twilio WhatsApp Sandbox**.
3. Insert them into your `.env`:
   ```env
   # WhatsApp Configuration (Twilio)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=+14155238886  # Twilio sandbox number
   ```

> [!WARNING]
> **API limitation:** While the frontend (`WhatsAppVerification.jsx`) tries to make a POST to `/api/whatsapp/send-otp` and the logic is present in `src/server/services/whatsappService.js`, the Express backend routing layer that wires these two together has *not been fully implemented yet*. A custom Express server will need to be configured to fully unblock real-world WhatsApp payloads.

### 4. Running the Development Server
To start the frontend along with the local Vite development server, execute:
```bash
npm run dev
```
Once initialized, the terminal will indicate success. You can open your browser and navigate to:
`http://127.0.0.1:3000`

---

## 🏗️ Project Architecture
- **Frontend Engine:** React 19 + Vite
- **Styling:** TailwindCSS 4
- **Local Database / State:** Designed passing state checks onto `localStorage` via context to fallback when a formalized backend API (`/api/auth`) is disconnected. This means adding documents or making mock logins dynamically persists automatically via your browser storage during presentations!
