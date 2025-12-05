# CathShield.ai - Getting Started Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb cathshield_db

# Import schema
psql cathshield_db < scripts/setup.sql
```

### 3. Configure Environment
```bash
cp .env.local.example .env.local

# Edit .env.local:
# DATABASE_URL=postgresql://localhost/cathshield_db
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to: **http://localhost:3000**

---

## 📖 Complete Workflow Demo

### Patient Flow (Step-by-Step)

#### Step 1: Patient Identification
1. Enter **Bed No.** (e.g., "ICU-105")
2. Enter **Initials** (e.g., "JD")
3. Select **Insertion Date**
4. Check patient risk factors (agitation, diabetes, etc.)
5. Complete nursing safety checklist
6. Click **"Proceed to Consent"**

#### Step 2: Audio Consent
1. **Listen to English consent** (mandatory)
2. Audio controls locked until playback complete
3. Optional: Click to play **vernacular consent** (Hindi, Tamil, Telugu)
4. Once playback finishes, checkbox unlocks
5. ✓ Check: "I have explained and obtained patient/guardian consent"
6. Click **"Proceed to Workflow"**

#### Step 3: 12-Hourly Image Capture
1. **Catheter Site Photo** (required)
   - Use camera or upload image
   - Assess dressing integrity
2. **Traction Device Photo** (optional)
   - If no photo, manually enter:
     - Yellow Pulls (last 12h)
     - Red Pulls (last 12h)
3. Click **"Upload & View Dashboard"**

#### Step 4: Patient Dashboard
1. View **CLISA Score** (0-7)
2. View **Predictive CLABSI Risk** (Green/Yellow/Red)
3. View **Venous Resistance Risk** (Green/Yellow/Red)
4. Review **Highlighted Nurse Action**
5. Log clinical events if needed:
   - Dressing Changed (⚪)
   - Catheter Changed (⚫)
   - Flushing Event (🟣)
6. Scroll down to see **Trend Plot**

#### Step 5: Trend Analysis
- 12-hourly CLISA score trend
- Venous resistance risk progression
- Event markers (dressing/catheter changes, flushing)
- Assess for emerging patterns

#### Step 6: Ward Analytics
1. Click **"Ward Analytics"** button
2. View **CLABSI Rate Trend** (last 30 days)
3. Input resource availability:
   - Patients needing today
   - Available dressings
   - Available catheters
4. Review **Resource Deprivation Rate**
   - Safe (0-10%) 🟢
   - Shortage (11-30%) 🟡
   - Major Shortage (31-60%) 🟠
   - Critical (>60%) 🔴

---

## 🔍 Testing Scenarios

### Scenario 1: Low-Risk Patient (Green)
```
- Dressing Integrity: 0 (good)
- Traction Pulls: 0
- Patient Factors: None
- Safety Checklist: All ✓
→ Result: Green | "Routine flush Q24h"
```

### Scenario 2: Moderate Risk (Yellow)
```
- Dressing Integrity: 2
- Traction Pulls: 2 yellow
- Patient Factors: Diabetes, TPN
- Safety Checklist: 3/4 ✓
→ Result: Yellow | "Flush Q12h + Inform MO"
```

### Scenario 3: High Risk (Red)
```
- Dressing Integrity: 4
- Traction Pulls: ≥1 red
- Patient Factors: Multiple (5+)
- Days on Catheter: >9
→ Result: Red | "Stop infusions + Emergency MO"
```

---

## 🗄️ Database

### Check Database Status
```bash
psql cathshield_db

# View tables
\dt

# Check patients
SELECT * FROM patients;

# Check risk scores
SELECT * FROM risk_scores;
```

### Reset Database
```bash
DROP DATABASE cathshield_db;
createdb cathshield_db;
psql cathshield_db < scripts/setup.sql
```

---

## 📱 Mobile Testing

### Test on Mobile Device (Same Network)
```bash
# Get local IP
ipconfig getifaddr en0  # macOS
hostname -I              # Linux

# Access from mobile browser
http://<YOUR_IP>:3000
```

### Mobile Features Tested
- ✓ Touch-friendly buttons
- ✓ Camera input support
- ✓ Responsive layouts
- ✓ Vertical scrolling
- ✓ Audio playback on mobile

---

## 🔧 Debugging

### Enable Console Logs
```typescript
// In src/lib/db.ts
console.log('Database query executed:', { query, duration });
```

### Browser DevTools
1. Press **F12**
2. Go to **Console** tab
3. Check for errors/warnings
4. Check **Network** tab for API calls

### Database Logs
```bash
# Enable PostgreSQL logs
psql cathshield_db
SELECT * FROM pg_stat_statements;
```

---

## 🎨 Customizing UI

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'medical-teal': '#008B8B',
  'medical-blue': '#0066CC',
  'medical-green': '#00AA66',
  // ... customize here
}
```

### Add Branding
Edit `src/app/page.tsx`:
```typescript
<h1 className="text-4xl font-bold">YOUR HOSPITAL NAME</h1>
```

---

## 📊 Mock Data

Use mock data during development:
```typescript
import { mockPatient, mockRiskScore } from '@/lib/mockData';

// Use in components
const patient = mockPatient;
const risk = mockRiskScore;
```

---

## 🚀 Deployment Checklist

- [ ] Database configured (PostgreSQL)
- [ ] Environment variables set
- [ ] SSL certificates installed
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Backups scheduled
- [ ] Monitoring alerts setup
- [ ] Security audit completed
- [ ] Healthcare compliance verified (HIPAA, etc.)

---

## 📚 Next Steps

1. **Integrate Gemini API** for image analysis
2. **Add real audio consent files** (text-to-speech)
3. **Connect to hospital EHR** (if available)
4. **Setup automated backups**
5. **Configure email/SMS alerts**
6. **Add advanced analytics**
7. **Mobile app development** (React Native)

---

## 🆘 Troubleshooting

### "Port 3000 in use"
```bash
# Use different port
PORT=3001 npm run dev
```

### "Database connection failed"
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check connection string
echo $DATABASE_URL
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Audio playback issues"
- Check browser supports HTML5 audio
- Verify audio files in `/public/audio/`
- Check browser console for errors

---

## 📞 Support

**Slack Channel**: #cathshield-dev
**Email**: support@cathshield.ai
**GitHub Issues**: https://github.com/yourrepo/cathshield/issues

---

**Happy Testing! 🏥✨**
