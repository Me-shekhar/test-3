# CathShield.ai - Hospital-Grade Medical Safety Web Application

## 🏥 Overview

CathShield.ai is a secure, hospital-grade web application designed to prevent Central Line-Associated Bloodstream Infections (CLABSI) and associated complications through continuous monitoring, risk assessment, and clinical decision support.

### 🎯 Key Features

- **Patient Identification & Consent**: Secure 12-hourly workflow with mandatory audio consent playback
- **Risk Assessment**: Integrated CLISA score + Predictive CLABSI risk calculation (Green/Yellow/Red)
- **Venous Resistance Monitoring**: Real-time assessment of traction-related complications
- **Clinical Alerts**: Automated alert generation based on risk thresholds
- **Nursing Actions**: Evidence-based CVL-RCRI protocol recommendations
- **Ward Analytics**: CLABSI rate tracking and trend analysis
- **Resource Deprivation**: Supply chain monitoring with automatic alerts for shortages
- **Trend Analysis**: 12-hourly trend plots with event markers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cathshield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your database and API credentials
   ```

4. **Setup PostgreSQL database**
   ```bash
   psql -U postgres -f scripts/setup.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Navigate to `http://localhost:3000`

## 📋 Workflow Overview

### 1️⃣ Patient Identification
- Enter Bed No., Patient Initials, Insertion Date
- Assess patient risk factors
- Complete nursing safety checklist
- Store anonymously (no real names)

### 2️⃣ Audio Consent Module
- Play English consent (mandatory playback)
- Optional vernacular consent
- Disable seeking until complete
- Confirm consent checkbox only after playback

### 3️⃣ 12-Hourly Monitoring
- Capture catheter site photo (required)
- Optional traction device photo
- Log traction pull counts if no photo
- Auto-scroll to dashboard

### 4️⃣ Patient Dashboard
- Display CLISA Score (0-7)
- Predictive CLABSI Risk (Green/Yellow/Red)
- Predictive Venous Resistance Risk
- Traction counts (24-72 hours)
- Highlighted nurse recommended action
- Event logging buttons

### 5️⃣ Trend Analysis
- 12-hourly trend plot
- Event markers (dressing change, catheter change, flushing)
- Risk band visualization
- Parallel venous resistance tracking

### 6️⃣ Clinical Alerts
- Auto-generated based on risk thresholds
- Severity color-coded
- Acknowledge functionality
- Timestamp tracking

### 7️⃣ Ward Analytics
- CLABSI rate calculation: `(cases × 1000) / CVL days`
- 30-day trend line
- % reduction badge
- Dressing & catheter change counts

### 8️⃣ Resource Deprivation
- Input: Patients needing, available dressings, available catheters
- Calculate deprivation rates
- Color bands: Safe (0-10%) | Shortage (11-30%) | Major (31-60%) | Critical (>60%)
- Auto-alert if >30%

## 🧠 Risk Engine Algorithm

### CLISA Score (Domain A + B)
- **Domain A**: Dressing integrity (0-4) + penalty if no recent change
- **Domain B**: Traction risk (0-3) based on pull counts

### Predictive CLABSI Score (0-10)
- **Domain C**: Patient systemic factors (0-3)
- **Domain D**: Dwell time adjustment (+1 if >9 days)
- Safety checklist bonus: -1 if all items passed

### CVL-RCRI Protocol
| Score | Action |
|-------|--------|
| 0-3   | Routine flush Q24h |
| 4-6   | Flush Q12h + Inform MO |
| 7-9   | Q8h + Urgent US |
| 10    | Stop infusions + Emergency MO |

## 🗄️ Database Schema

### Core Tables
- `patients` - Patient records (anonymized: bed_no + initials only)
- `consent_records` - Audio playback and consent tracking
- `image_captures` - 12-hourly photo uploads
- `risk_scores` - Computed risk assessments
- `clinical_alerts` - Generated alerts
- `event_logs` - Dressing/catheter changes, flushing
- `ward_analytics` - CLABSI rates and trends
- `resource_deprivation` - Supply monitoring

## 🔌 API Endpoints

### Patients
- `POST /api/patients` - Create patient
- `GET /api/patients` - List/fetch patient

### Consent
- `POST /api/consent` - Record consent
- `GET /api/consent` - Fetch consent record

### Images
- `POST /api/images` - Upload images
- `GET /api/images` - Fetch image history

### Risk Scores
- `POST /api/risk-score` - Compute score
- `GET /api/risk-score` - Fetch latest score

### Alerts
- `POST /api/alerts` - Create alert
- `GET /api/alerts` - Fetch alerts
- `PATCH /api/alerts` - Acknowledge alert

### Events
- `POST /api/events` - Log event
- `GET /api/events` - Fetch event history

### Ward Analytics
- `GET /api/ward-analytics` - Fetch CLABSI trends
- `POST /api/ward-analytics` - Record analytics

### Resource Deprivation
- `POST /api/resource-deprivation` - Calculate deprivation
- `GET /api/resource-deprivation` - Fetch current status

## 🎨 UI/UX Design

### Color Scheme
- **Teal**: Primary (#008B8B)
- **Medical Blue**: Secondary (#0066CC)
- **Green**: Risk-free (#00AA66)
- **Yellow**: Warning (#FFB81C)
- **Orange**: Caution (#FF8C00)
- **Red**: Critical (#DD0000)

### Typography
- Large, clinical-readable fonts (16px+ for body text)
- Clear hierarchy for mobile + tablet
- Accessibility: WCAG AA compliant

### Privacy & Security
- **Never display real names** → Bed No. + Initials only
- All data encrypted in transit (HTTPS)
- Audio consent: no seeking allowed
- Session management with localStorage

## 📱 Mobile & Tablet Support

- Responsive grid layouts
- Touch-friendly buttons (min 44x44px)
- Camera/file input for image capture
- Vertical scrolling on small screens

## 🔒 Security & Compliance

- Patient anonymization (Bed No. + Initials)
- Audio consent enforcement
- Input validation & sanitization
- HTTPS-only deployment
- PostgreSQL parameterized queries (SQL injection protection)
- Session tokens & CSRF protection (to be added)

## 🧪 Testing

```bash
# Run unit tests (to be configured)
npm test

# Run linting
npm run lint
```

## 📚 Validation

**Cited Research:**
- Content validity (SCVI ≥ .82)
- Internal consistency (Cronbach's α = .82)
- External validation ongoing

**Footer disclaimer** displayed on all pages.

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment
```
NEXT_PUBLIC_API_URL=https://your-domain.com
DATABASE_URL=postgresql://user:password@host:5432/cathshield_db
NODE_ENV=production
```

## 📖 Future Enhancements

- [ ] ML model integration for image analysis (Gemini API)
- [ ] Multi-language support (Hindi, Tamil, Telugu, Kannada)
- [ ] Mobile app (React Native)
- [ ] SMS/Email alerts
- [ ] Real-time dashboard synchronization (WebSocket)
- [ ] Advanced analytics (predictive modeling)
- [ ] Integration with hospital EHR systems

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For issues, questions, or contributions, please contact the development team or open an issue on the repository.

---

**CathShield.ai** - Protecting patients. Every hour. Every day.
