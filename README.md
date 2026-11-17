# WHERE DID I PARK? 🛵
### Smart Two-Wheeler Campus Parking Management System
**Course:** Design Thinking (`INT335 P07`)  
**University:** Lovely Professional University (LPU), Punjab, India  

---

## 👥 Project Team Members

| Name | Registration No. | Project Role | Email |
| :--- | :--- | :--- | :--- |
| **Priyanshu Raj** | **12509608** | **Team Leader & Full-Stack Architect** | priyanshu.12509608@lpu.in |
| **Ujwal Tiwari** | **12515973** | UI/UX & User Research Specialist | ujwal.12515973@lpu.in |
| **Sagar Kumar** | **12506347** | Database & Systems Engineer | sagar.12506347@lpu.in |
| **Om Jaiswal** | **12509320** | Map Analytics & Field Testing Lead | om.12509320@lpu.in |

---

## 🎯 Project Purpose & Design Thinking Problem Statement
Lovely Professional University has thousands of students and faculty members commuting daily on motorcycles and scooters. During peak morning lecture shifts (8:30 AM – 10:30 AM), students face two severe friction points:
1. **Parking Search Fatigue:** Circling congested blocks (e.g. Block 25, 26, 28) seeking vacant two-wheeler slots, resulting in late arrival to classes.
2. **Vehicle Recall Amnesia:** Forgetting where a vehicle was parked among hundreds of identical two-wheelers across extensive campus bays after 6-8 hours of lectures.

**Where Did I Park?** provides an interactive smart-parking web prototype that helps commuters:
- Check real-time parking lot occupancy near target academic blocks.
- View live distance and walking times.
- Navigate via an interactive OpenStreetMap campus map.
- Save their vehicle registration, bay, section, slot, and landmark notes in 10 seconds.
- Follow turn-by-turn directions back to their vehicle.

---

## 💻 Technology Stack

- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling & UI:** Tailwind CSS (custom dark navy & sky blue palette, modern rounded cards, custom scrollbars)
- **Icons:** Lucide React
- **Mapping & GIS:** Leaflet & OpenStreetMap (custom color-coded markers: Green = Available, Orange = Limited, Red = Full, Blue Pulse = User Vehicle)
- **Data Visualization & Analytics:** Recharts (Hourly occupancy trends, capacity comparisons, fleet distribution)
- **Persistence & Backend:**
  - **Local Demo Mode:** Built-in `localStorage` reactive service that works instantly without requiring API keys or network connection.
  - **Supabase Integration:** Full PostgreSQL schema with 7 tables, Row Level Security (RLS), and client setup ready in `supabase/schema.sql`.

---

## 🚀 Key Features

### 1. Student / Commuter Portal
- **Dashboard:** Live vacancy counters, current selected academic block, quick action tiles, and active saved vehicle status.
- **Find Parking:** Destination selector (Block 25, 26, 27, 28, 29, 30, Library, Main Academic Area), lot cards with distances, walking times, occupancy gauges, filter by vacancy, and sorting.
- **Interactive Campus Map:** Leaflet map with colored lot pins, popups with live counts, academic block highlight, and walking guidance routes.
- **Save My Parking:** Quick spot recording with vehicle type (Motorcycle, Scooter, EV), registration plate number, lot selector, section, visual slot selector, and landmark notes.
- **Find My Vehicle:** Active tracker showing parked slot, elapsed time, copy details action, turn-by-turn walking steps back to bike, and spot release.
- **Parking History:** Personal log of previous parking sessions with search, vehicle filter, and delete options.
- **In-App Notifications:** Real-time feedback when spots are saved, saturation alerts, and security advisories.

### 2. Admin & Security Directorate Portal
- **Admin Overview:** Campus-wide capacity, occupied slots, available spaces, and overall occupancy rate.
- **Manage Parking Lots (Full CRUD):** Add new two-wheeler bays, edit capacities, calibrate occupied counts with `+` / `-` buttons, update statuses, and assign academic blocks.
- **Parking Analytics:** Hourly congestion curves, weekly traffic volume, and vehicle technology breakdown (geared, gearless, EV, bicycle).
- **Broadcast Alerts:** Push campus traffic announcements and lot closure advisories to all riders.

---

## 🛠️ Quick Start Instructions

### Prerequisites
- Node.js (v18+) or Bun runtime installed.

### 1. Installation
```bash
# Clone or navigate to the repository
cd "Where I Park"

# Install dependencies (using bun or npm)
bun install
# OR: npm install
```

### 2. Run the Development Server
```bash
bun run dev
# OR: npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Demonstration Walkthrough (For Faculty Review)
1. **Top Banner:** View INT335 P07 project details and click "Team Members (4)" to verify student credentials.
2. **Switch Roles:** Use the pill in the header to switch between **Student View** and **Admin View** seamlessly.
3. **Core Student Flow:**
   - Select destination **Block 28** on the Dashboard.
   - Click **Find Parking** → Observe distance and vacancy for *Two-Wheeler Bay A*.
   - Click **Save This Parking** → Registration number is prefilled (`PB10AB1234`), select Section `B`, Slot `B-12`, and click Save.
   - Click **Find My Vehicle** → View parked details, click **Navigate Back (Directions)** to test walking steps.
4. **Admin Flow:**
   - Switch role to **Admin**.
   - Navigate to **Manage Parking Lots** → Use the `+` / `-` counters to observe live capacity adjustments and status badge updates.
   - Navigate to **Parking Analytics** → Review Recharts hourly occupancy curves and fleet pie charts.

---

## 🗄️ Supabase PostgreSQL Setup (Optional)
If connecting to a live Supabase cloud project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor and execute the contents of `supabase/schema.sql`.
3. Copy your project URL and anon public key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart the development server. The app automatically detects the keys and syncs with Supabase!

---

*Developed for INT335 Design Thinking (Lovely Professional University, Phagwara, Punjab).*
