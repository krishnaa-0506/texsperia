# TEXPERIA 2026 - Single Application Setup

Complete event registration system with consolidated frontend and backend.

## 🚀 Quick Start

### One Command to Run Everything:
```bash
npm run dev
```

Frontend and Backend will both start automatically!

## 📋 What You Get

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js API
- **Database:** MongoDB
- **Admin Panel:** Secure dashboard with password protection

## 🎯 Access Points

| Component | URL |
|-----------|-----|
| Website | http://localhost:5173 |
| API Backend | http://localhost:3001 |
| Admin Panel | Click yellow shield icon on site |

## 📂 Project Structure

```
texperia-2026/
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── App.tsx           # Main app
│   └── main.tsx          # Entry point
├── api/                   # Express backend
│   ├── index.js          # API server
│   ├── .env              # MongoDB & config
│   └── uploads/          # Screenshots
├── package.json          # All dependencies
└── vite.config.ts        # Vite config
```

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure with your credentials:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB_NAME=your_database_name
ADMIN_PASSWORD=your_secure_admin_password
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3001
```
⚠️ **Never commit `.env` file** - it's in `.gitignore`

## 🎯 Available Scripts

```bash
npm run dev       # ✅ Start everything
npm run build     # Build for production
npm run preview   # Preview production
npm run lint      # ESLint
npm run api       # API only
```

## 🎪 Events

**Day 1 (6 Technical Events)** - ₹10,000 each  
**Day 2 (2 Events)** - ₹3,000 each
- Esports
- Best Manager

**Fee:** ₹400/participant | Food, Refreshments & Certificates Included

## 👥 User Features

✅ Select participation day  
✅ Choose up to 3 events  
✅ Manage team details  
✅ Upload payment screenshot  
✅ Get registration confirmation  

## 🔐 Admin Features

**Access:** Yellow shield icon (bottom-right)  
**Password:** Set via `ADMIN_PASSWORD` environment variable

✅ View all registrations  
✅ Statistics dashboard  
✅ Export to CSV  
✅ View payment screenshots  
✅ Real-time data refresh  

## 💾 Data Storage

- **MongoDB:** All registration data (cloud)
- **Local:** Payment screenshots in `api/uploads/`
- **Export:** CSV backup anytime

## 🔧 Troubleshooting

**Port in use?**
```bash
# Kill process on port 3001
netstat -ano | findstr :3001  # Windows
lsof -ti:3001 | xargs kill -9  # Mac/Linux
```

**MongoDB error?**
- Check internet connection
- Verify MongoDB URL in `api/.env`
- Whitelist IP in MongoDB Atlas

**Admin password wrong?**
Change in `api/.env` → ADMIN_PASSWORD

## 🚀 Production

```bash
npm run build  # Creates dist/
```

Deploy `dist/` to: Vercel, Netlify, GitHub Pages, etc.

---

**🎉 Ready? Just run:**
```bash
npm run dev
```

## 🎯 Features

- **Registration System**: Day 1 & Day 2 events with team/individual options
- **Payment Integration**: UPI payment with screenshot upload
- **Admin Panel**: Secure admin dashboard with password protection
- **Export Data**: Download all registrations as CSV
- **Statistics**: Real-time registration and revenue tracking

## 💾 Technology Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- File Storage: Local filesystem (server/uploads)

## 📂 Project Structure

```
├── src/                    # Frontend React application
│   ├── components/        # React components
│   │   ├── HeroSection.tsx
│   │   ├── EventsSection.tsx
│   │   ├── RegistrationForm.tsx
│   │   └── AdminPanel.tsx
│   └── App.tsx           # Main app component
├── server/               # Backend Express server
│   ├── index.js         # API endpoints
│   ├── package.json     # Backend dependencies
│   └── .env            # Configuration (MongoDB URL)
└── QUICKSTART.md       # Quick setup guide
```

## 🔧 Setup

1. **Add MongoDB URL**
   - Edit `server\.env`
   - Add your MongoDB connection string
   - See [MONGODB_URL_NEEDED.txt](MONGODB_URL_NEEDED.txt)

2. **Install Dependencies**
   ```powershell
   .\setup.ps1
   ```

3. **Start Application**
   ```powershell
   .\start.ps1
   ```

## 🎪 Events

### Day 1 - Technical Events (₹10,000 each)
- AM Ideathon
- Paper Presentation
- Innoventure
- CAD Design Challenge
- RC Car Race
- Junk Wars

### Day 2 - Skill & Strategy Events (₹3,000 each)
- Esports
- Best Manager

**Registration Fee:** ₹400 per participant (includes food, refreshments, certificates)

## 🔐 Admin Access

- Click the yellow shield icon (bottom-right corner)
- Password is set in environment variable `ADMIN_PASSWORD`
- See `NETLIFY_SETUP.md` or `.env.example` for configuration

## 📊 Admin Features

- View all registrations
- Registration statistics dashboard
- Export data to CSV
- View payment screenshots
- Filter by participation day

## 🛡️ Security

- Password-protected admin panel
- Secure MongoDB connection
- Environment variables for sensitive data
- No data loss - all stored in MongoDB

## 📝 API Endpoints

### Public
- `POST /api/register` - Submit registration

### Admin (Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/registrations` - Get all registrations
- `GET /api/admin/stats` - Get statistics

## 🆘 Support

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📜 License

© 2026 MMCT - TEXPERIA Event

