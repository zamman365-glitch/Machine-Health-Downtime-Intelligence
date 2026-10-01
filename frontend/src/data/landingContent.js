// Factual Landing Page Content Data

export const HERO_CONTENT = {
  badge: "Predictive Maintenance Intelligence",
  title: "Predict Machine Failures Before They Cause Expensive Downtime",
  subtitle: "Analyze machine operating parameters in real-time to forecast failure probabilities and estimate maintenance costs powered by machine learning models.",
  primaryCta: "Try the Predictor",
  secondaryCta: "See how it works",
};

export const TECH_STACK = [
  { name: "FastAPI", role: "High-performance Python API backend" },
  { name: "scikit-learn", role: "Classification & Regression ML models" },
  { name: "PostgreSQL", role: "Relational database with audit trail & BI view" },
  { name: "React + Vite", role: "Modern frontend dashboard interface" },
  { name: "Power BI", role: "Integrated analytics & operational view" },
];

export const PROBLEM_SOLUTION = {
  eyebrow: "The Maintenance Challenge",
  title: "Transition From Reactive Repairs to Predictive Intelligence",
  problem: {
    title: "The Unplanned Downtime Problem",
    description: "Unexpected equipment breakdowns interrupt production lines, spike repair costs, and damage machinery. Manual inspections often miss subtle thermal or rotational stress patterns until catastrophic failure occurs."
  },
  solution: {
    title: "The Sensor-Driven Solution",
    description: "Our machine learning platform analyzes real-time sensor parameters—air temperature, process temperature, rotational speed, torque, and tool wear—to compute instantaneous failure risk and estimate repair expenses before failure occurs."
  }
};

export const FEATURES = [
  {
    id: "failure_prediction",
    title: "Failure Risk Prediction",
    description: "Classification model predicts binary failure probability with Low (<30%), Medium (30-60%), and High (>60%) risk level classification.",
    icon: "AlertTriangle"
  },
  {
    id: "cost_estimation",
    title: "Maintenance Cost Estimation",
    description: "Regression model estimates expected repair & overhaul expense in real-time based on machine operating stress.",
    icon: "DollarSign"
  },
  {
    id: "derived_metrics",
    title: "Derived Engineering Metrics",
    description: "Client-side computation of critical physical indicators: Temperature Difference (Proc - Air), Average Temperature, and Mechanical Power (rpm × Torque).",
    icon: "Gauge"
  },
  {
    id: "history_export",
    title: "Prediction History & Export",
    description: "Log up to 20 recent predictions in local browser storage with interactive Recharts trend visualization and instant CSV file export.",
    icon: "History"
  },
  {
    id: "api_monitoring",
    title: "Live API Status Monitoring",
    description: "Automated polling ping (GET /) every 30 seconds ensures continuous visibility into backend service health and readiness.",
    icon: "Activity"
  },
  {
    id: "power_bi",
    title: "PostgreSQL & Power BI View",
    description: "Backend predictions write directly to a PostgreSQL database connected to a specialized SQL view (machine_health_overview) for Power BI analytics.",
    icon: "Database"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Enter Machine Parameters",
    description: "Input sensor readings for air temperature, process temperature, rotational speed, torque, tool wear, and product quality type (L, M, H)."
  },
  {
    step: "02",
    title: "Models Analyze Features",
    description: "FastAPI receives the payload, computes feature engineering transforms, scales features, and passes them to scikit-learn models."
  },
  {
    step: "03",
    title: "Receive Risk & Cost Estimates",
    description: "Get real-time failure probability, risk status badge (Low, Medium, High), binary verdict, and currency-formatted cost estimates."
  },
  {
    step: "04",
    title: "Track History & Export Data",
    description: "Every prediction is saved to the backend PostgreSQL database and displayed in your interactive frontend history log & trend chart."
  }
];

export const MODEL_DATA_SPECS = {
  eyebrow: "Architecture & Data",
  title: "Trained on Synthetic Industrial Sensor Records",
  description: "The platform relies on pre-trained scikit-learn classification and regression models fit on the AI4I 2020 Predictive Maintenance Dataset.",
  inputs: [
    { name: "Product Quality Type", unit: "L / M / H", desc: "Low, Medium, or High variant specification" },
    { name: "Air Temperature", unit: "K", desc: "Ambient environmental temperature (295–304 K)" },
    { name: "Process Temperature", unit: "K", desc: "Internal operating process temperature (305–314 K)" },
    { name: "Rotational Speed", unit: "rpm", desc: "Spindle speed of machine tool (1100–2900 rpm)" },
    { name: "Torque", unit: "Nm", desc: "Mechanical torque load applied (3–77 Nm)" },
    { name: "Tool Wear", unit: "min", desc: "Cumulative tool operation wear time (0–255 min)" }
  ],
  derived: [
    { name: "Temperature Difference", desc: "Process Temp minus Air Temp (K)" },
    { name: "Average Temperature", desc: "Mean of Air and Process Temp (K)" },
    { name: "Power", desc: "Rotational Speed multiplied by Torque (rpm × Nm)" }
  ],
  outputs: [
    { name: "Failure Probability & Prediction", desc: "Binary verdict (0/1) & probability score (0.00–1.00)" },
    { name: "Estimated Maintenance Cost", desc: "Predicted repair & overhaul cost (INR)" }
  ]
};

export const FAQS = [
  {
    question: "What does this machine health platform predict?",
    answer: "The platform evaluates operational sensor inputs to produce two primary predictions: (1) Machine failure probability and binary verdict using a classification model, and (2) Estimated maintenance & repair cost using a regression model."
  },
  {
    question: "What sensor inputs are required for an accurate prediction?",
    answer: "The API requires six input parameters: Product Quality Type (L, M, H), Air Temperature (K), Process Temperature (K), Rotational Speed (rpm), Torque (Nm), and Tool Wear (minutes). The backend also calculates derived features (Temperature Difference, Average Temperature, and Power) prior to model evaluation."
  },
  {
    question: "How were the machine learning models trained?",
    answer: "The classification and regression models were built using scikit-learn and trained on 10,000 synthetic industrial records from the AI4I 2020 Predictive Maintenance Dataset. Feature scaling and categorical encoding pipelines are loaded automatically at API startup."
  },
  {
    question: "Where are prediction records stored?",
    answer: "Each API prediction call writes a structured record to a PostgreSQL database table (`predictions`). The backend database contains a dedicated SQL view (`machine_health_overview`) designed for seamless integration with Power BI dashboards."
  },
  {
    question: "Can I integrate these endpoints into an automated monitoring pipeline?",
    answer: "Yes! The FastAPI backend exposes RESTful HTTP POST endpoints (`/predict/failure` and `/predict/cost`) accepting standard JSON payloads with CORS enabled, making it easy to integrate with industrial IoT gateways or web dashboards."
  }
];
