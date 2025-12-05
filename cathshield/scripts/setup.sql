-- PostgreSQL Schema for CathShield.ai
-- Hospital-Grade Central Line Management System

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY,
  bed_no VARCHAR(50) NOT NULL,
  initials VARCHAR(10) NOT NULL,
  insertion_date TIMESTAMP NOT NULL,
  patient_factors JSONB,
  safety_checklist JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consent Records
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  audio_played BOOLEAN DEFAULT FALSE,
  audio_language_used VARCHAR(50),
  playback_finished_timestamp TIMESTAMP,
  consent_obtained BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image Captures (12-hourly)
CREATE TABLE IF NOT EXISTS image_captures (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  cathetersite_url TEXT NOT NULL,
  traction_device_url TEXT,
  yellow_pulls INTEGER DEFAULT 0,
  red_pulls INTEGER DEFAULT 0,
  captured_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX patient_date_idx (patient_id, captured_at)
);

-- Risk Scores
CREATE TABLE IF NOT EXISTS risk_scores (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  clisa_score INTEGER,
  predictive_clabsi_score INTEGER,
  predictive_clabsi_band VARCHAR(20),
  predictive_venous_resistance_band VARCHAR(20),
  recommended_action TEXT,
  action_color VARCHAR(20),
  computed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX patient_date_idx (patient_id, computed_at DESC)
);

-- Clinical Alerts
CREATE TABLE IF NOT EXISTS clinical_alerts (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  severity VARCHAR(20),
  recommended_action TEXT,
  timestamp TIMESTAMP NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX patient_time_idx (patient_id, timestamp DESC)
);

-- Event Logs (dressing change, catheter change, flushing)
CREATE TABLE IF NOT EXISTS event_logs (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  logged_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX patient_date_idx (patient_id, logged_at DESC)
);

-- Ward Analytics
CREATE TABLE IF NOT EXISTS ward_analytics (
  id SERIAL PRIMARY KEY,
  ward_id VARCHAR(100) NOT NULL,
  date TIMESTAMP NOT NULL,
  clabsi_cases INTEGER DEFAULT 0,
  total_central_line_days INTEGER DEFAULT 0,
  dressing_change_count INTEGER DEFAULT 0,
  catheter_change_count INTEGER DEFAULT 0,
  derived_rate NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (ward_id, date),
  INDEX ward_date_idx (ward_id, date DESC)
);

-- Resource Deprivation
CREATE TABLE IF NOT EXISTS resource_deprivation (
  id UUID PRIMARY KEY,
  ward_id VARCHAR(100) NOT NULL,
  patients_needing_today INTEGER,
  available_dressings INTEGER,
  available_catheters INTEGER,
  dressing_deprivation_rate NUMERIC(10, 2),
  catheter_deprivation_rate NUMERIC(10, 2),
  combined_deprived_rate NUMERIC(10, 2),
  deprivation_band VARCHAR(50),
  alert_triggered BOOLEAN DEFAULT FALSE,
  computed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX ward_time_idx (ward_id, computed_at DESC)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_patients_created ON patients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consent_patient ON consent_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_images_patient ON image_captures(patient_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_patient ON risk_scores(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_patient ON clinical_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_events_patient ON event_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_ward_analytics_ward ON ward_analytics(ward_id);
CREATE INDEX IF NOT EXISTS idx_deprivation_ward ON resource_deprivation(ward_id);
