# Quick Start Guide - HR to Manager Approval Flow

## What Was Built

A complete approval pipeline that connects the HR Portal's "Review & Approve" button to the Manager Portal's Interviews page.

### Flow:
1. **HR** reviews candidates in the Feedback page
2. **HR** clicks "Review & Approve" and enters manager email
3. Candidate is sent to **Manager Backend API** (port 8001)
4. **Manager** sees the candidate in their Interviews page
5. **Manager** approves or rejects
6. **HR** sees the manager's decision back in the Feedback page

---

## Start the Application

You need **3 terminals** open:

### Terminal 1: HR Backend (Port 8000)
```powershell
cd C:\Users\SistlaGaneshAkhila\OneDrive - SprintPark\Desktop\HrInterviewAiAgent\HrInterviewAiAgent\sruthi\hr_onboarding

# Activate venv
.\.venv\Scripts\Activate.ps1

# Run HR backend
cd backend
python fastapi_feedback1.py
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
✅ MongoDB connected → mongodb://localhost:27017 / hr_interview_ai
```

---

### Terminal 2: Manager Backend (Port 8001)
```powershell
cd C:\Users\SistlaGaneshAkhila\OneDrive - SprintPark\Desktop\HrInterviewAiAgent\HrInterviewAiAgent\sruthi\hr_onboarding

# Activate venv (if not already)
.\.venv\Scripts\Activate.ps1

# Run Manager backend
cd backend\manager_backend
python manager_api.py
```

**Expected output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
✅ MongoDB connected → mongodb://localhost:27017 / hr_interview_ai
```

---

### Terminal 3: Frontend (Port 3000)
```powershell
cd C:\Users\SistlaGaneshAkhila\OneDrive - SprintPark\Desktop\HrInterviewAiAgent\HrInterviewAiAgent\sruthi\hr_onboarding\frontend

npm run dev
```

**Expected output**:
```
  ▲ Next.js 15.5.19
  - Local:        http://localhost:3000
  - Network:      http://0.0.0.0:3000
  
✓ Ready in 2.3s
```

---

## Test the Flow

### Step 1: Login as HR
1. Open browser: **http://localhost:3000/login**
2. Login credentials:
   - Email: `sneha.m@recruitai.app`
   - Password: `recruitai123`

### Step 2: Go to Feedback Page
1. Click **Feedback** in the sidebar
2. You'll see a list of candidates with interview rounds
3. Find a candidate with completed rounds

### Step 3: Approve a Candidate
1. Click **"Review & Approve"** button on any candidate
2. A modal will open showing:
   - Overall rating
   - Recommendation (Strong Hire / Hire / etc.)
   - Round-by-round summary
   - Skill ratings
3. **Enter manager email**: `arjun.k@recruitai.app`
4. Click **"Approve & Send Summary"**
5. You should see **"✓ Approved & Sent!"**

### Step 4: Login as Manager
1. Logout (top-right corner)
2. Click **"Sign in"** again
3. Login credentials:
   - Email: `arjun.k@recruitai.app`
   - Password: `recruitai123`

### Step 5: View Approved Candidates
1. Click **Interviews** in the sidebar
2. You should see a **"Sent for Manager Review"** section
3. The candidate you approved appears there with:
   - ✓ HR Approved badge
   - Candidate details (name, role, rounds)
   - HR Rating and Recommendation
   - **Approve** / **Reject** buttons

### Step 6: Manager Approves/Rejects
1. Click **"Approve"** or **"Reject"** button
2. The decision is saved immediately
3. Status updates to **"✓ Approved"** or **"✗ Rejected"**

### Step 7: HR Sees Manager Decision (Coming Soon)
1. Logout and login back as HR
2. Go to Feedback page
3. The candidate's **"Status"** column will show:
   - **Pending** (if manager hasn't decided)
   - **Approved** (if manager approved)
   - **Rejected** (if manager rejected)

---

## Troubleshooting

### Manager Backend Won't Start
**Error**: `Cannot import database`

**Fix**: Make sure `backend/manager_backend/database.py` exists. If not, it should contain:
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
    except:
        return False
```

---

### Candidate Not Appearing in Manager Portal
**Checklist**:
1. ✓ Both backends running (8000 and 8001)
2. ✓ MongoDB is running
3. ✓ You approved the candidate as HR
4. ✓ No errors in backend terminal logs
5. ✓ Click **"Refresh"** button on Manager Interviews page

**Debug**: Check the backend logs for errors. If you see:
```
404: No interview record found for candidate_id=...
```

This means the candidate doesn't have a `backendId` in the frontend. Make sure you're loading candidates from the HR backend (`GET /interviews/`) which assigns backendId.

---

### Frontend API Connection Issues
**Error**: `Failed to send approval to manager`

**Fix**:
1. Check `frontend/.env.local` contains:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_MANAGER_API_BASE_URL=http://localhost:8001
   ```
2. Restart frontend dev server after changing `.env.local`
3. Clear browser cache

---

### MongoDB Not Running
**Error**: `MongoDB connection failed`

**Fix**:
```powershell
# Start MongoDB (if installed via installer)
mongod --dbpath C:\data\db

# Or if using MongoDB service
net start MongoDB
```

---

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   HR Portal     │         │  Manager Backend │         │ Manager Portal  │
│  (localhost:    │────────▶│   (localhost:    │◀────────│  (localhost:    │
│    3000)        │  POST   │     8001)        │  GET    │    3000)        │
│                 │ /hr-    │                  │ /approved│                 │
│ FeedbackPage    │ approve │  manager_api.py  │ -cands  │ InterviewsPage  │
│ "Review &       │         │                  │         │ Shows HR-       │
│  Approve"       │         │   MongoDB        │         │ approved cands  │
│                 │         │   ↓ Saves to     │         │ Approve/Reject  │
│                 │         │   manager_       │         │ buttons         │
│                 │         │   approvals      │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

---

## What Each File Does

### Backend

**`backend/manager_backend/manager_api.py`** (NEW)
- Port 8001
- Handles HR→Manager approval pipeline
- Endpoints:
  - `POST /manager/hr-approve` - HR submits approval
  - `GET /manager/approved-candidates` - Manager fetches candidates
  - `PATCH /manager/approved-candidates/{id}/decision` - Manager decides

**`backend/manager_backend/database.py`** (NEW)
- MongoDB connection for Manager Backend
- Connects to same DB as HR backend (`hr_interview_ai`)
- Uses `manager_approvals` collection

**`backend/fastapi_feedback1.py`** (Existing, unchanged)
- Port 8000
- HR backend
- Handles interviews, feedback, AI reports

### Frontend

**`frontend/app/hr_portal/feedback/FeedbackPage.tsx`** (MODIFIED)
- Shows candidates with feedback
- "Review & Approve" button
- `handleSend()` function now calls Manager Backend API

**`frontend/app/Manager_Portal/interviews/ManagerInterviewsPage.tsx`** (MODIFIED)
- Fetches HR-approved candidates from Manager Backend
- Shows Approve/Reject buttons
- Updates candidate status on decision

**`frontend/lib/interviewStore.tsx`** (MODIFIED)
- Added `managerDecisions` state
- Added `approveManagerFeedback()` and `rejectManagerFeedback()` functions

**`frontend/.env.local`** (NEW)
- Environment variables for API URLs

---

## MongoDB Collections

### `manager_approvals` (NEW)
Stores HR approval records and manager decisions:
```json
{
  "candidate_id": "507f1f77bcf86cd799439011",
  "candidate_name": "Sarah Mitchell",
  "role": "Senior Backend Engineer",
  "overall_rating": 94.5,
  "recommendation": "Strong Hire",
  "hr_note": "Excellent candidate...",
  "hr_approved_at": "2026-06-09T10:30:00Z",
  "status": "pending_manager",
  "manager_decision": null,
  "manager_note": null
}
```

### `interview_details` (Existing)
Shared with HR backend. Manager Backend updates the `manager_approval` field:
```json
{
  "candidate_id": "507f1f77bcf86cd799439011",
  "name": "Sarah Mitchell",
  "rounds": [...],
  "manager_approval": {
    "status": "pending_manager",
    "hr_approved_at": "2026-06-09T10:30:00Z"
  }
}
```

---

## Next Steps / Future Enhancements

1. **Email Notifications**: Send actual emails to managers when HR approves
2. **Real-time Updates**: Use WebSockets for live status updates
3. **Audit Log**: Track all approval/rejection actions
4. **Manager Notes**: Allow managers to add notes when deciding
5. **Bulk Actions**: Approve/reject multiple candidates at once
6. **Analytics Dashboard**: Track approval rates, time-to-decision, etc.

---

## Support

For issues or questions:
1. Check backend logs in both terminals
2. Check browser console for errors (F12)
3. Verify MongoDB is running: `mongosh` → `show dbs`
4. Read `backend/MANAGER_API_README.md` for detailed API docs

---

## Files Modified/Created

### Created:
- ✨ `backend/manager_backend/manager_api.py`
- ✨ `backend/manager_backend/database.py`
- ✨ `frontend/.env.local`
- ✨ `backend/MANAGER_API_README.md`
- ✨ `QUICK_START.md` (this file)

### Modified:
- ✏️ `frontend/app/hr_portal/feedback/FeedbackPage.tsx`
- ✏️ `frontend/lib/interviewStore.tsx`
- ✏️ `frontend/components/ManagerSummaryModal.tsx` (minor fix)

### Unchanged:
- ✓ `backend/fastapi_feedback1.py` (HR backend)
- ✓ `frontend/app/Manager_Portal/interviews/ManagerInterviewsPage.tsx` (already had the UI)
- ✓ All other files
