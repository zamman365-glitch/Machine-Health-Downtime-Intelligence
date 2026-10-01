# Machine Health Predictive Maintenance Platform & React Dashboard

A production-quality React 18 + Vite application featuring a marketing landing page and interactive prediction dashboard for the **Machine Health API** service.

---

## Page Routes

- **`/`**: Marketing Landing Page featuring hero product preview, verified tech stack strip, problem vs solution overview, 6 feature cards, 4-step workflow, live interactive API teaser widget, dataset/model specs, and accessible FAQ accordion.
- **`/predict`**: Interactive Predictor Dashboard for testing live machine parameter inputs, analyzing failure probability gauges, viewing cost estimates, and tracking logs.
- **`*`**: Custom 404 Not Found page with return navigation.

---

## Technical Stack & Features

- **Framework**: React 18 + Vite with `react-router-dom` client-side routing.
- **Styling**: Tailwind CSS with custom design tokens (`tailwind.config.js`), supporting class-based dark mode (`class="dark"`).
- **Charts**: Recharts (`AreaChart` with gradient fill for risk history trends).
- **Icons**: Lucide React.
- **Testing**: Vitest unit tests for validation and risk calculation logic.
- **Resilient Network Client**:
  - Parallel endpoint execution (`/predict/failure` and `/predict/cost`) using `Promise.allSettled`.
  - 10-second request timeout via `AbortController`.
  - Partial success support with per-card loading skeletons and inline retry buttons.
- **Local Persistence**: Prediction history (up to 20 entries) and dark/light theme choices persisted in `localStorage` with `try-catch` safety wrappers.

---

## How to Edit Landing Page Copy

All copy strings, FAQs, and feature definitions live in a single content data file:
- **`src/data/landingContent.js`**

To customize headlines, features, or FAQs, simply update the corresponding objects in `src/data/landingContent.js`.

---

## Prerequisites

- **Node.js**: Version 18 or higher (`node -v`).
- **FastAPI Backend**: Running at `http://127.0.0.1:8000` (`uvicorn app:app --reload`).

---

## Installation & Running Locally

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The dashboard will open at **`http://localhost:5173`**.

4. **Run Unit Tests**:
   ```bash
   npm run test
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Placeholders & Assumptions

- **GitHub Link**: Uses `https://github.com` placeholder in the footer as requested.
- **No Fabricated Stats**: Metrics on accuracy or customer counts are excluded since they were not specified in project files.
- **Explicit Demo API Calls**: The live teaser widget on the landing page triggers backend predictions strictly upon explicit user click to prevent database bloat.
