# 🚀 TEXPERIA 2026 - One Command Setup

## ⚡ Everything is Consolidated!

Just run ONE command:

```bash
npm run dev
```

✅ Frontend (React) on http://localhost:5173  
✅ Backend (API) on http://localhost:3001  
✅ Both running simultaneously

## 🎯 Next Steps

1. **Open Browser** → http://localhost:5173
2. **Test Registration** → Fill the form and register
3. **Admin Access** → Click yellow shield icon (bottom-right)
4. **Admin Login** → Password: `hkkk@admin2026`

## 📂 What's Where

```
Project Root/
├── src/              # Frontend (React)
├── api/              # Backend (Express)
├── api/.env          # MongoDB URL (already configured)
├── package.json      # All dependencies
└── npm run dev       # Run everything!
```

## ✨ Features

**Users Can:**
- Register for events
- Upload payment screenshot
- Get instant confirmation

**Admins Can:**
- View all registrations
- See statistics
- Export to CSV
- View payment proof

## 🔐 MongoDB & Settings

Edit `api/.env`:
```env
MONGODB_URI=...
ADMIN_PASSWORD=hkkk@admin2026
```

## 📋 All Commands

```bash
npm run dev      # Frontend + Backend
npm run build    # Production build
npm run lint     # Code linting
npm run api      # API only
```

## 🎪 Events

**Day 1:** 6 Technical Events (₹10,000 each)  
**Day 2:** Esports & Best Manager (₹3,000 each)  
**Registration:** ₹400 per person

## 💾 Data

- **Stored in:** MongoDB (automatic)
- **Screenshots:** Local storage in `api/uploads/`
- **Backup:** Export to CSV anytime

## 🆘 Issues?

- **Port busy?** Kill process on port 3001
- **MongoDB error?** Check URL in `api/.env`
- **Admin password?** Default is `hkkk@admin2026`

---

## 🎉 That's It!

```bash
npm run dev
```

Everything runs together. No separate setup needed! 🚀

## 🎯 Access Points

- **Website:** http://localhost:5173
- **Admin Panel:** Click yellow shield icon (bottom-right)
- **Admin Password:** `hkkk@admin2026`

## 📦 What Changed?

✅ **Removed:** Supabase  
✅ **Added:** MongoDB + Express Backend  
✅ **Added:** Admin Panel with password protection  
✅ **Added:** File upload for payment screenshots  

## 🗄️ MongoDB Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login (FREE)
3. Create a cluster (FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Paste in `server\.env`

## 🔐 Security

- Default admin password: `hkkk@admin2026`
- Change it in `server\.env`
- Never share your MongoDB URL

## ✅ Features

### For Users:
- Register for Day 1 or Day 2 events
- Choose up to 3 events
- Upload payment screenshot
- Get registration confirmation

### For Admins:
- View all registrations
- See statistics (total registrations, revenue)
- Export data to CSV
- View payment screenshots
- Filter by day

## 🎪 Events

**Day 1 (6 events):** ₹10,000 each  
**Day 2 (2 events):** ₹3,000 each  
**Registration:** ₹400/participant

## 📝 No Data Loss

- All registrations saved to MongoDB
- Payment screenshots stored in `server/uploads/`
- Export to CSV anytime from admin panel

## 🆘 Troubleshooting

**Server won't start?**
- Check MongoDB URL in `server\.env`
- Make sure port 3001 is free

**Can't access admin?**
- Password: `hkkk@admin2026`
- Make sure backend is running

**Registration failing?**
- Check if both frontend and backend are running
- Open browser console (F12) for errors

## 📞 Support
For issues, check SETUP_GUIDE.md for detailed instructions.
