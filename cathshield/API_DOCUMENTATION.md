# CathShield.ai API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently uses client-side session management via localStorage. In production, implement JWT/OAuth2.

---

## 📋 Patients API

### Create Patient
```http
POST /api/patients
Content-Type: application/json

{
  "bedNo": "ICU-105",
  "initials": "JD",
  "insertionDate": "2024-12-05",
  "patientFactors": {
    "agitation": true,
    "diabetes": true,
    "tpn": true,
    "extremeAge": false,
    "obesity": false,
    "ckd": false,
    "cancer": false,
    "dialysis": false,
    "immunosuppression": false,
    "malnutrition": false
  },
  "safetyChecklist": {
    "capsClosed": true,
    "glovesWorn": true,
    "noAbnormalities": true,
    "dressingIntact": true
  }
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "bed_no": "ICU-105",
    "initials": "JD",
    "insertion_date": "2024-12-05T00:00:00Z",
    "created_at": "2024-12-05T10:30:00Z"
  }
}
```

### Get Patient
```http
GET /api/patients?patientId=550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "bed_no": "ICU-105",
    "initials": "JD",
    "patient_factors": { ... },
    "safety_checklist": { ... }
  }
}
```

---

## 🎤 Consent API

### Record Consent
```http
POST /api/consent
Content-Type: application/json

{
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "audioLanguageUsed": "English"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "consentId": "550e8400-e29b-41d4-a716-446655440001",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "patient_id": "550e8400-e29b-41d4-a716-446655440000",
    "audio_played": true,
    "audio_language_used": "English",
    "playback_finished_timestamp": "2024-12-05T10:35:00Z",
    "consent_obtained": true
  }
}
```

### Get Latest Consent
```http
GET /api/consent?patientId=550e8400-e29b-41d4-a716-446655440000
```

---

## 📷 Images API

### Upload Images
```http
POST /api/images
Content-Type: multipart/form-data

{
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "cathetersite": <File>,
  "tractionDevice": <File> (optional),
  "yellowPulls": 2,
  "redPulls": 0
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "captureId": "550e8400-e29b-41d4-a716-446655440002",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "patient_id": "550e8400-e29b-41d4-a716-446655440000",
    "cathetersite_url": "s3://bucket/image-001.jpg",
    "traction_device_url": null,
    "yellow_pulls": 2,
    "red_pulls": 0,
    "captured_at": "2024-12-05T10:40:00Z"
  }
}
```

### Get Image History
```http
GET /api/images?patientId=550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    { ... },
    { ... }
  ]
}
```

---

## 🔢 Risk Score API

### Compute Risk Score
```http
POST /api/risk-score
Content-Type: application/json

{
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "daysOnCatheter": 5,
  "dressingIntegrityScore": 3,
  "dressingRecentChange": true,
  "yellowPullsLast12h": 2,
  "redPullsLast12h": 0,
  "patientFactors": { ... },
  "safetyChecklist": { ... }
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "scoreId": "550e8400-e29b-41d4-a716-446655440003",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "patient_id": "550e8400-e29b-41d4-a716-446655440000",
    "clisa_score": 3,
    "predictive_clabsi_score": 4,
    "predictive_clabsi_band": "yellow",
    "predictive_venous_resistance_band": "green",
    "recommended_action": "Flush Q12h + Inform Medical Officer",
    "action_color": "yellow",
    "computed_at": "2024-12-05T10:45:00Z"
  }
}
```

### Get Latest Score
```http
GET /api/risk-score?patientId=550e8400-e29b-41d4-a716-446655440000
```

---

## ⚠️ Alerts API

### Create Alert
```http
POST /api/alerts
Content-Type: application/json

{
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "Predictive CLABSI Risk = Yellow",
  "severity": "yellow",
  "recommendedAction": "Increase flushing to Q12h"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "alertId": "550e8400-e29b-41d4-a716-446655440004",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "patient_id": "550e8400-e29b-41d4-a716-446655440000",
    "reason": "Predictive CLABSI Risk = Yellow",
    "severity": "yellow",
    "recommended_action": "Increase flushing to Q12h",
    "timestamp": "2024-12-05T10:45:00Z",
    "acknowledged": false
  }
}
```

### Get Alerts
```http
GET /api/alerts?patientId=550e8400-e29b-41d4-a716-446655440000
```

### Acknowledge Alert
```http
PATCH /api/alerts
Content-Type: application/json

{
  "alertId": "550e8400-e29b-41d4-a716-446655440004"
}
```

---

## 📊 Events API

### Log Event
```http
POST /api/events
Content-Type: application/json

{
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "dressing_change"
}
```

**Supported Event Types:**
- `dressing_change`
- `catheter_change`
- `flushing`

### Get Event History
```http
GET /api/events?patientId=550e8400-e29b-41d4-a716-446655440000
```

---

## 📈 Ward Analytics API

### Get CLABSI Trends
```http
GET /api/ward-analytics?wardId=ward-icu-1&days=30
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "ward_id": "ward-icu-1",
      "date": "2024-11-05T00:00:00Z",
      "clabsi_cases": 2,
      "total_central_line_days": 45,
      "dressing_change_count": 30,
      "catheter_change_count": 2,
      "derived_rate": 44.44
    }
  ],
  "stats": {
    "percentReduction": "25.5",
    "totalDays": 30
  }
}
```

### Record Ward Analytics
```http
POST /api/ward-analytics
Content-Type: application/json

{
  "wardId": "ward-icu-1",
  "clabsiCases": 0,
  "totalCentralLineDays": 52,
  "dressingChangeCount": 38,
  "catheterChangeCount": 0
}
```

---

## 🏥 Resource Deprivation API

### Calculate Deprivation
```http
POST /api/resource-deprivation
Content-Type: application/json

{
  "wardId": "ward-icu-1",
  "patientsNeedingToday": 8,
  "availableDressings": 5,
  "availableCatheters": 8
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "ward_id": "ward-icu-1",
    "patients_needing_today": 8,
    "available_dressings": 5,
    "available_catheters": 8,
    "dressing_deprivation_rate": 37.5,
    "catheter_deprivation_rate": 0,
    "combined_deprived_rate": 18.75,
    "deprivation_band": "shortage",
    "alert_triggered": false
  }
}
```

### Get Current Status
```http
GET /api/resource-deprivation?wardId=ward-icu-1
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "patientId required"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

---

## Rate Limiting

**Current Status**: None implemented (add for production)

---

## CORS Configuration

Production deployment should configure CORS headers:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Testing with cURL

### Create Patient
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "bedNo": "ICU-105",
    "initials": "JD",
    "insertionDate": "2024-12-05",
    "patientFactors": {...},
    "safetyChecklist": {...}
  }'
```

### Upload Images
```bash
curl -X POST http://localhost:3000/api/images \
  -F "patientId=550e8400-e29b-41d4-a716-446655440000" \
  -F "cathetersite=@cathetersite.jpg" \
  -F "yellowPulls=2" \
  -F "redPulls=0"
```

---

## Postman Collection

Import the collection into Postman for easy API testing. Collection file available at: `./docs/CathShield.ai.postman_collection.json`

---

**Last Updated**: 2024-12-05
**API Version**: v1.0
