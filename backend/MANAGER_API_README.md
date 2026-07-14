# Manager Backend API - Setup & Usage

## Overview
The Manager Backend API handles the **HR → Manager approval pipeline**. When HR clicks "Review & Approve" in the Feedback page, the candidate is sent to the Manager Portal's Interviews page for final approval.

## Architecture

```
HR Portal (Frontend)                Manager Portal (Frontend)
     ↓                                     ↓
  FeedbackPage.tsx                  ManagerInterviewsPage.tsx
     ↓                                     ↓
     ↓                                     ↓
  POST /manager/hr-approve          GET /manager/approved-candidates
     ↓                                     ↓
     └──────────→  manager_api.py  ←───────┘
                         ↓
                   MongoDB (hr_interview_ai)
                   - interview_details (shared, read-only)
                   - manager_approvals (new, read/write)
```

## MongoDB Collections

### `interview_details` (shared with HR backend)
- **DB**: `hr_interview_ai`
- **Access**: Read-only
- **Purpose**: Fetch candidate details for embedding in approval records

### `manager_approvals` (Manager Backend exclusive)
- **DB**: `hr_interview_ai`
- **Access**: Read/Write
- **Purpose**: Store HR approval records + manager decisions
- **Schema**:
  ```json
  {
    "candidate_id": "507f1f77bcf86cd799439011",
    "candidate_name": "Sarah Mitchell",
    "candidate_email": "sarah.mitchell@email.com",
    "initials": "SM",
    "color": "#8b5cf6",
    "role": "Senior Backend Engineer",
    "rounds": [...],
    "overall_rating": 94.5,
    "recommendation": "Strong Hire",
    "hr_note": "Excellent technical skills...",
    "hr_approved_at": "2026-06-09T10:30:00Z",
    "status": "pending_manager" | "approved" | "rejected",
    "manager_decision": null | "approved" | "rejected",
    "manager_note": "",
    "manager_decided_at": null | "2026-06-09T14:30:00Z",
    "updated_at": "2026-06-09T10:30:00Z"
  }
  ```

## API Endpoints

### 1. POST /manager/hr-approve
**Called by**: HR Portal Feedback page when clicking "Review & Approve"

**Request Body**:
```json
{
  "candidate_id": "507f1f77bcf86cd799439011",
  "hr_note": "Strong candidate with excellent system design skills",
  "overall_rating": 94.5,
  "recommendation": "Strong Hire"
}
```

**Response**:
```json
{
  "success": true,
  "candidate_id": "507f1f77bcf86cd799439011",
  "status": "pending_manager",
  "message": "Sarah Mitchell sent to Manager Portal interviews."
}
```

### 2. GET /manager/approved-candidates
**Called by**: Manager Portal Interviews page on load

**Query Params**:
- `status` (optional): Filter by `pending_manager` | `approved` | `rejected`

**Response**:
```json
{
  "candidates": [
    {
      "candidate_id": "507f1f77bcf86cd799439011",
      "candidate_name": "Sarah Mitchell",
      "candidate_email": "sarah.mitchell@email.com",
      "initials": "SM",
      "color": "#8b5cf6",
      "role": "Senior Backend Engineer",
      "rounds": [...],
      "overall_rating": 94.5,
      "recommendation": "Strong Hire",
      "hr_note": "Strong candidate...",
      "hr_approved_at": "2026-06-09T10:30:00Z",
      "status": "pending_manager",
      "manager_decision": null,
      "manager_note": null
    }
  ],
  "total": 1
}
```

### 3. GET /manager/approved-candidates/{candidate_id}
**Called by**: Manager Portal for single candidate detail view

**Response**: Single candidate object (same schema as array item above)

### 4. PATCH /manager/approved-candidates/{candidate_id}/decision
**Called by**: Manager Portal when clicking Approve or Reject

**Request Body**:
```json
{
  "decision": "approved",
  "note": "Great candidate, moving forward with offer"
}
```

**Response**:
```json
{
  "success": true,
  "candidate_id": "507f1f77bcf86cd799439011",
  "decision": "approved",
  "message": "Candidate Sarah Mitchell has been approved by manager."
}
```

## Setup & Run

### 1. Install Dependencies
```bash
cd backend
pip install fastapi uvicorn motor pymongo python-dotenv
```

Or using the virtual environment:
```bash
cd sruthi/hr_onboarding
.\.venv\Scripts\Activate.ps1  # PowerShell
pip install -r backend/manager_backend/requirements.txt
```

### 2. Environment Variables
Make sure your `backend/.env` file contains:
```env
MONGO_URI=mongodb://localhost:27017
MANAGER_DB_NAME=hr_interview_ai
```

### 3. Start the Manager Backend
```bash
cd backend/manager_backend
python manager_api.py
```

The API will start on **http://localhost:8001**

### 4. Verify It's Running
```bash
curl http://localhost:8001/manager/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "manager-backend",
  "timestamp": "2026-06-09T10:30:00+00:00"
}
```

## Running Both Backends Together

You need **TWO terminal windows**:

**Terminal 1 - HR Backend (port 8000)**:
```bash
cd sruthi/hr_onboarding/backend
.\.venv\Scripts\python.exe fastapi_feedback1.py
```

**Terminal 2 - Manager Backend (port 8001)**:
```bash
cd sruthi/hr_onboarding/backend/manager_backend
..\.venv\Scripts\python.exe manager_api.py
```

**Terminal 3 - Frontend (port 3000)**:
```bash
cd sruthi/hr_onboarding/frontend
npm run dev
```

## Frontend Configuration

Make sure `frontend/.env.local` (or environment variables) contains:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_MANAGER_API_BASE_URL=http://localhost:8001
```

If the file doesn't exist, create it:
```bash
cd frontend
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 >> .env.local
echo NEXT_PUBLIC_MANAGER_API_BASE_URL=http://localhost:8001 >> .env.local
```

## Testing the Flow

### End-to-End Test

1. **Start all three servers** (HR backend, Manager backend, Frontend)

2. **Login as HR** (`sneha.m@recruitai.app` / `recruitai123`)

3. **Go to Feedback page** (`/hr_portal/feedback`)

4. **Click "Review & Approve"** on any candidate

5. **Enter a manager email** (e.g., `arjun.k@recruitai.app`)

6. **Click "Approve & Send Summary"**

7. **Switch to Manager Portal**:
   - Logout from HR
   - Login as Manager (`arjun.k@recruitai.app` / `recruitai123`)
   - Go to Interviews page (`/Manager_Portal/interviews`)

8. **Verify**:
   - The candidate appears in the "Sent for Manager Review" section
   - Status shows "Pending"
   - You can click "Approve" or "Reject"

9. **Approve/Reject** the candidate

10. **Go back to HR Portal** → Feedback page
    - The candidate's "Status" column should update to "Approved" or "Rejected"

## Troubleshooting

### Manager Backend Not Starting
**Error**: `Cannot import database`

**Fix**: Make sure `database.py` exists in `backend/manager_backend/` with MongoDB connection:
```python
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("MANAGER_DB_NAME", "hr_interview_ai")

client = AsyncIOMotorClient(MONGO_URI)
db     = client[DB_NAME]

async def ping_db():
    try:
        await client.admin.command("ping")
        return True
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return False
```

### Frontend Can't Reach Manager Backend
**Error**: `Failed to send approval to manager`

**Fix**: 
1. Check Manager Backend is running on port 8001
2. Check frontend `.env.local` has `NEXT_PUBLIC_MANAGER_API_BASE_URL=http://localhost:8001`
3. Restart frontend dev server after changing .env

### CORS Error
**Error**: `Access to fetch at 'http://localhost:8001' from origin 'http://localhost:3000' has been blocked by CORS`

**Fix**: Manager API already has CORS enabled (`allow_origins=["*"]`). If still seeing errors:
1. Clear browser cache
2. Restart Manager Backend
3. Check browser console for detailed error

### Candidate Not Appearing in Manager Portal
**Checklist**:
1. ✓ Manager Backend running on 8001
2. ✓ MongoDB running and accessible
3. ✓ `backendId` field exists on candidate (check browser console)
4. ✓ No errors in Manager Backend logs
5. ✓ Click "Refresh" button on Manager Interviews page

**Debug**: Check MongoDB directly:
```bash
mongosh
use hr_interview_ai
db.manager_approvals.find().pretty()
```

### Status Not Syncing Back to HR Portal
The manager decision **does sync back** via the `interview_details` collection's `manager_approval` field. If not seeing updates:

1. Refresh the HR Feedback page
2. Check `interview_details` in MongoDB:
   ```bash
   db.interview_details.find({ "manager_approval.status": "approved" }).pretty()
   ```
3. Make sure the HR Portal is reading from the same database

## Database Indexes (Optional but Recommended)

For better performance, create these indexes:

```bash
mongosh
use hr_interview_ai

# Index for fast lookups in manager_approvals
db.manager_approvals.createIndex({ "candidate_id": 1 }, { unique: true })
db.manager_approvals.createIndex({ "status": 1 })
db.manager_approvals.createIndex({ "hr_approved_at": -1 })

# Index for syncing back to interview_details
db.interview_details.createIndex({ "candidate_id": 1 }, { unique: true })
```

## API Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     HR Portal (Frontend)                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ FeedbackPage.tsx                                        │ │
│  │  - Shows candidates with feedback                       │ │
│  │  - "Review & Approve" button                           │ │
│  │  - Collects manager email                              │ │
│  └────────────────────┬────────────────────────────────────┘ │
│                       │                                       │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        │ POST /manager/hr-approve
                        │ { candidate_id, hr_note, ... }
                        ↓
┌──────────────────────────────────────────────────────────────┐
│              Manager Backend API (Port 8001)                  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ manager_api.py                                          │ │
│  │  - Receives HR approval                                 │ │
│  │  - Saves to manager_approvals collection               │ │
│  │  - Updates interview_details.manager_approval           │ │
│  └────────────────────┬────────────────────────────────────┘ │
│                       │                                       │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        │ MongoDB Write
                        ↓
┌──────────────────────────────────────────────────────────────┐
│                   MongoDB (hr_interview_ai)                   │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ manager_approvals                                     │  │
│  │  - HR approval records                                │  │
│  │  - Manager decisions                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ interview_details (shared)                            │  │
│  │  - manager_approval.status field synced              │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │ GET /manager/approved-candidates
                        ↓
┌──────────────────────────────────────────────────────────────┐
│                  Manager Portal (Frontend)                    │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ManagerInterviewsPage.tsx                               │ │
│  │  - Fetches HR-approved candidates                       │ │
│  │  - Shows Approve / Reject buttons                       │ │
│  │  - PATCH /.../{id}/decision on click                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Summary

- **HR Backend** (port 8000): Handles interviews, feedback, AI reports
- **Manager Backend** (port 8001): Handles HR→Manager approval pipeline
- **Frontend** (port 3000): Serves both HR and Manager portals
- **MongoDB**: Single database (`hr_interview_ai`) with two collections for coordination

The Manager Backend acts as a **coordination layer** between HR and Manager portals, ensuring that:
1. HR approvals are captured with context
2. Managers see only HR-approved candidates
3. Manager decisions sync back to HR
4. All state changes are persisted in MongoDB
