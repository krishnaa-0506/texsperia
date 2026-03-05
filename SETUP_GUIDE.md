# TEXPERIA 2026 - MMCT Events Registration System

## Overview
This is the event registration system for TEXPERIA 2026. It uses MongoDB for data storage and includes an admin panel for managing registrations.

## Setup Instructions

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Configure MongoDB

1. Copy the server environment example file:
```bash
cd server
copy .env.example .env
```

2. Edit `server/.env` and add your MongoDB connection URL:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/texperia?retryWrites=true&w=majority
ADMIN_PASSWORD=hkkk@admin2026
PORT=3001
```

**To get your MongoDB URL:**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
- Create a new cluster
- Click "Connect" and choose "Connect your application"
- Copy the connection string and replace `<password>` with your database password
- Paste it in the `.env` file as `MONGODB_URI`

### 4. Run the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```
The server will run on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
The frontend will run on http://localhost:5173

## Features

### User Registration
- Select participation day (Day 1 or Day 2)
- Choose up to 3 events
- Individual and team event support
- UPI payment integration
- Payment screenshot upload
- Real-time form validation

### Admin Panel
- **Access:** Click the yellow shield icon in the bottom-right corner
- **Default Password:** `hkkk@admin2026` (can be changed in `server/.env`)
- View all registrations
- Statistics dashboard (total registrations, revenue, day-wise count)
- Export data to CSV
- View detailed registration information
- View payment screenshots

## Day 1 Events (Technical)
- AM Ideathon - ₹10,000
- Paper Presentation - ₹10,000
- Innoventure - ₹10,000
- CAD Design Challenge - ₹10,000
- RC Car Race - ₹10,000
- Junk Wars - ₹10,000

## Day 2 Events (Skill & Strategy)
- Esports - ₹3,000
- Best Manager - ₹3,000

## Pricing
- ₹400 per participant
- Maximum 3 events per registration
- Includes food, refreshments, and certificates

## Technical Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **File Upload:** Multer

## API Endpoints

### Public Endpoints
- `POST /api/register` - Register for events

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/registrations` - Get all registrations
- `GET /api/admin/stats` - Get registration statistics

## Security Notes
- Change the default admin password in `server/.env`
- Never commit the `.env` file to version control
- Keep your MongoDB credentials secure

## Data Storage
- **Registrations:** Stored in MongoDB `texperia` database
- **Payment Screenshots:** Stored in `server/uploads/` directory
- **Backup:** Regularly export data using the admin panel's CSV export feature

## Troubleshooting

### Server Connection Error
- Make sure the backend server is running on port 3001
- Check if MongoDB connection string is correct in `.env`

### Registration Not Working
- Verify the backend server is running
- Check browser console for errors
- Ensure MongoDB is accessible

### Admin Panel Not Opening
- Check if the password matches the one in `server/.env`
- Verify the backend server is running

## Support
For any issues or questions, contact the MMCT technical team.
