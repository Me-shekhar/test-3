# CathShield.ai - Quick Reference Cheat Sheet

## 🚀 Quick Start Commands

```bash
# Install & setup
npm install
createdb cathshield_db
psql cathshield_db < scripts/setup.sql
cp .env.local.example .env.local

# Start development
npm run dev

# Open
http://localhost:3000
```

---

## 📍 Navigation Guide

| Page | URL | Purpose |
|------|-----|---------|
| Home (Patient ID) | `/` | Create new patient record |
| Consent | `/consent` | Audio consent verification |
| Workflow | `/workflow` | 12-hourly image upload |
| Dashboard | `/dashboard` | Patient risk assessment |
| Analytics | `/analytics` | Ward metrics & resources |

---

## 🧮 Risk Scoring Quick Math

### CLISA Score (0-7)
- Dressing integrity: 0-4
- Traction risk: 0-3

### Predictive CLABSI (0-10)
- Domain A + B + C + D
- Minus 1 if all safety checks pass

### Action Protocol
```
0-3 → Green  | Q24h
4-6 → Yellow | Q12h + MO
7-9 → Orange | Q8h + US
10  → Red    | Stop + Emergency
```

### Deprivation Rate
```
Rate = (Patients - Available) / Patients × 100
0-10%    → Safe 🟢
11-30%   → Shortage 🟡
31-60%   → Major 🟠
>60%     → Critical 🔴
```

---

## 🎨 Color System

| Color | Use | Hex |
|-------|-----|-----|
| 🟢 Green | Safe/Low Risk | #00AA66 |
| 🟡 Yellow | Warning/Moderate | #FFB81C |
| 🟠 Orange | Caution/High | #FF8C00 |
| 🔴 Red | Critical/Emergency | #DD0000 |
| Medical Blue | Primary | #0066CC |
| Medical Teal | Secondary | #008B8B |

---

## 🗄️ Database Tables

### Core Tables
- `patients` - Patient records
- `consent_records` - Consent tracking
- `image_captures` - Photo uploads
- `risk_scores` - Risk calculations
- `clinical_alerts` - Alerts
- `event_logs` - Event tracking
- `ward_analytics` - CLABSI metrics
- `resource_deprivation` - Supply status

### Common Queries
```sql
-- Get patient
SELECT * FROM patients WHERE id = '...';

-- Get latest risk score
SELECT * FROM risk_scores WHERE patient_id = '...' LIMIT 1;

-- Get alerts
SELECT * FROM clinical_alerts WHERE patient_id = '...' ORDER BY timestamp DESC;

-- Get ward analytics
SELECT * FROM ward_analytics WHERE ward_id = '...' ORDER BY date DESC;
```

---

## 🔌 API Endpoints Quick Reference

### Patients
- `POST /api/patients` - Create
- `GET /api/patients?patientId=xxx` - Fetch

### Consent
- `POST /api/consent` - Record
- `GET /api/consent?patientId=xxx` - Get

### Images
- `POST /api/images` - Upload
- `GET /api/images?patientId=xxx` - History

### Risk Scores
- `POST /api/risk-score` - Compute
- `GET /api/risk-score?patientId=xxx` - Fetch

### Alerts
- `POST /api/alerts` - Create
- `GET /api/alerts?patientId=xxx` - List
- `PATCH /api/alerts` - Acknowledge

### Events
- `POST /api/events` - Log
- `GET /api/events?patientId=xxx` - List

### Ward Analytics
- `GET /api/ward-analytics?wardId=xxx&days=30` - Trends
- `POST /api/ward-analytics` - Record

### Resource Deprivation
- `POST /api/resource-deprivation` - Calculate
- `GET /api/resource-deprivation?wardId=xxx` - Status

---

## 🧩 Component Library

| Component | Location | Purpose |
|-----------|----------|---------|
| Footer | `components/Footer.tsx` | Validation footer (all pages) |
| PrivacyStatement | `components/PrivacyStatement.tsx` | Privacy banner |
| AudioConsent | `components/AudioConsent.tsx` | Audio player |
| RiskBadge | `components/RiskBadge.tsx` | Risk level badge |
| AlertCard | `components/AlertCard.tsx` | Alert display |
| TrendPlot | `components/TrendPlot.tsx` | Trend chart |

---

## 📝 Key Files & Modules

| File | Purpose |
|------|---------|
| `src/lib/riskEngine.ts` | Risk calculation logic |
| `src/lib/resourceDeprivation.ts` | Deprivation calculation |
| `src/lib/audioConsent.ts` | Audio consent content |
| `src/lib/mockData.ts` | Demo data |
| `src/types/index.ts` | TypeScript interfaces |
| `src/lib/db.ts` | PostgreSQL connection |

---

## 🧪 Test Data

### Low Risk (Green)
- Dressing: 0, Pulls: 0, Factors: 0, Days: 3
- Score: 2 → "Q24h flush"

### Medium Risk (Yellow)
- Dressing: 2, Pulls: 2Y, Factors: 2, Days: 5
- Score: 4 → "Q12h + MO"

### High Risk (Red)
- Dressing: 4, Pulls: 1R, Factors: 5, Days: 10
- Score: 10 → "Stop + Emergency"

---

## 🔐 Security Checklist

- ✅ Never display real patient names
- ✅ Use Bed No. + Initials only
- ✅ Enforce audio consent playback
- ✅ Disable audio seeking until complete
- ✅ Use parameterized SQL queries
- ✅ Validate all inputs
- ✅ HTTPS ready (add SSL in prod)
- ✅ Session management (localStorage)

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px

All pages fully responsive
Touch-friendly: buttons ≥ 44x44px
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `PORT=3001 npm run dev` |
| DB connection error | Check `DATABASE_URL` in `.env.local` |
| Module not found | `npm install` then restart |
| Audio not playing | Check `/public/audio/` files exist |
| TypeScript errors | Run `npm run build` |
| Styling issues | Clear `.next/` folder |

---

## 📊 Monitoring Checklist

- [ ] All 6 pages loading
- [ ] Database connected
- [ ] API endpoints responding
- [ ] Audio playing in browser
- [ ] Images uploading
- [ ] Risk scores calculating
- [ ] Alerts generating
- [ ] Charts rendering
- [ ] Mobile responsive
- [ ] Privacy statement visible

---

## 🎯 Key Compliance Points

✅ SCVI ≥ .82 (content validity)
✅ Cronbach's α = .82 (internal consistency)
✅ WCAG AA accessibility
✅ HIPAA patient anonymization
✅ Evidence-based CVL-RCRI protocol
✅ Footer validation on all pages

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| `README.md` | Full overview |
| `GETTING_STARTED.md` | Step-by-step guide |
| `API_DOCUMENTATION.md` | API reference |
| `PROJECT_SUMMARY.md` | Complete feature list |
| This file | Quick cheat sheet |

---

## 🚀 Deployment Checklist

- [ ] PostgreSQL configured
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] CORS configured
- [ ] Audio files uploaded
- [ ] Database backups enabled
- [ ] Error logging setup
- [ ] Performance monitoring
- [ ] Security audit completed
- [ ] Healthcare compliance verified

---

## 🎁 Ready for

✅ Development
✅ Testing
✅ Hackathon
✅ Production (with additions)
✅ Research
✅ Hospital deployment

---

**Print or bookmark this page!**
Last updated: 2024-12-05
