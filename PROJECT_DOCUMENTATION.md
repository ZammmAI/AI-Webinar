# AI Webinar Registration Site | Project Documentation

## 1. Executive Summary
The **Academy of Billionaires (AOB) AI Webinar** site is a high-performance, exclusive registration platform designed to drive community growth while maintaining the scarcity and prestige of a 100-seat live Zoom session. It focuses on a "Hybrid Waitlist" model that ensures every lead is captured and funneled into the private WhatsApp ecosystem.

---

## 2. Technical Infrastructure
*   **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) (Lightning-fast HMR and production builds).
*   **Language**: [TypeScript](https://www.typescript.org/) (Full type-safety for registration schemas and database interactions).
*   **Backend & DB**: [Supabase](https://supabase.com/) (PostgreSQL with Realtime capabilities for live seat counting).
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first styling for high-performance UI components).
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Premium transitions, floating background elements, and state shifts).
*   **Icons**: [Lucide React](https://lucide.dev/).

---

## 3. Core Features & Logic
### **3.1. Hybrid Waitlist System**
The site manages a "Hard Cap" of 100 seats but remains open for unlimited community growth:
*   **Seats 1–100**: Automatically tagged as **`confirmed`**. Users see a "Welcome Aboard" screen.
*   **Seats 101+**: Automatically tagged as **`waitlist`**. Users see a "Priority Waitlist" screen.
*   **The Bridge**: Both confirmed and waitlisted users are invited to the unified **AOB WhatsApp Group**, ensuring 100% community retention regardless of Zoom capacity.

### **3.2. Real-time Seat Counter**
*   **Sync Logic**: Uses `supabase.channel()` to listen for `INSERT` events on the database.
*   **Optimization**: The UI increments state locally rather than re-fetching the full count, providing sub-millisecond visual updates to all active visitors.
*   **Urgency Hooks**: The counter stops at "0 Spots Left" when the 100-seat limit is reached, maintaining high pressure for new visitors to join the waitlist.

### **3.3. Performance Engine**
*   **Zero-Lag Submission**: The `onSubmit` flow is optimized to transition the UI to the success screen the microsecond Supabase confirms the entry.
*   **Database Indexing**: Critical indexes added to `email` and `created_at` to ensure high-speed lookups even as the database grows.

---

## 4. UI/UX Design Philosophy
### **4.1. The "Billionaire" Palette**
*   **Primary (Navy)**: `#1a237e` (Blue-800) for buttons and branding stability.
*   **Success (Emerald)**: `#10b981` (Emerald-500) for confirmation states and accents.
*   **Urgency (Amber)**: `#f59e0b` (Amber-500) for waitlist states and high-priority warnings.
*   **Depth**: Multi-layered gradients from `emerald-900` to `slate-900` for a deep, cinematic look.

### **4.2. Master Typography**
*   **Branding**: `Cinzel` (Google Fonts) – Used for "ACADEMY OF BILLIONAIRES" and premium status headers.
*   **Modern Interaction**: `Outfit` (Google Fonts) – Used for input fields and body text for a "Next-Gen" tech feel.
*   **Technical Clarity**: `Inter` (Google Fonts) – Used for labels and fine-print to ensure readability.

### **4.3. Accessibility & Contrast**
*   **High-Visibility Labels**: 100% opaque white labels for all input fields.
*   **Interactive Roles**: Brightened selectors for "Developer," "Designer," etc., ensuring they are legible even on low-brightness mobile screens.

---

## 5. Database Schema & Security
### **Table: `webinar_registrations`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier. |
| `name` | TEXT | Full name of the participant. |
| `email` | TEXT | Validated email address. |
| `phone` | TEXT | Formatted with `+94` prefix. |
| `age` | TEXT | Relaxed range (1–120). |
| `role` | TEXT | Journey identifier (e.g., student, founder). |
| `status` | TEXT | `confirmed` or `waitlist`. |
| `created_at` | TIMESTAMPTZ | Auto-generated timestamp for sorting. |

### **Security Settings**
*   **RLS (Row Level Security)**: Enabled.
*   **Public Access**: Allowed for `INSERT` only (protects existing registrant data from the public).
*   **Service Role**: Admin-only read access.

---

## 6. Maintenance & Post-Webinar
### **Resetting for a New Session**
To reset the site for a new webinar:
1.  **Clear Table**: Run `TRUNCATE webinar_registrations;` in the Supabase SQL editor.
2.  **Update Date/Time**: Update the `Hero.tsx` date and time constants.
3.  **Deploy**: Push changes to GitHub.

### **Exporting Registrants**
User data can be exported from the Supabase dashboard as a **CSV** for email campaigns or WhatsApp broadcast lists.

---

## 7. Version History
*   **v1.0 (Initial)**: Hard-block at 100 seats.
*   **v2.0 (Hybrid)**: Implementation of waitlist logic and community group conversion.
*   **v3.0 (Performance)**: Comprehensive audit for sub-second processing and typography overhaul.

---
**Documentation Created**: April 20, 2026
**Created by**: Antigravity (Powered by AOB)
