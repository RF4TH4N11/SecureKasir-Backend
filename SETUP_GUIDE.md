# Setup Guide - SecureKasir Backend

## Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- Node.js (v14 atau lebih tinggi)
- npm (biasanya sudah included dengan Node.js)
- MongoDB Atlas account (sudah tersedia, gunakan URI yang diberikan)

## Installation Steps

### 1. Clone/Download Project

```bash
cd /path/to/project
cd SecureKasir-Backend
```

### 2. Install Dependencies

```bash
npm install
```

Ini akan menginstall semua package yang diperlukan:

- express - Framework web
- mongoose - MongoDB ODM
- cors - Cross-Origin Resource Sharing
- dotenv - Environment variables
- express-validator - Validation
- bcryptjs - Password hashing (untuk future use)
- jsonwebtoken - JWT (untuk future use)
- nodemon - Auto-reload pada development

### 3. Setup Environment Variables

Buat atau edit file `.env` dengan konfigurasi:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://capung_db_user:Stefani21%40@capung.xxfvnno.mongodb.net/securekasir
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

**Note:** File `.env` sudah ada dengan konfigurasi di atas.

### 4. Test MongoDB Connection

Jalankan server untuk test koneksi:

#### Development Mode (dengan auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

Jika berhasil, output akan menampilkan:

```
✅ MongoDB connected: cluster.mongodb.net
🚀 Server running on http://localhost:3000
📝 API Documentation at http://localhost:3000/api
```

### 5. Test API

Buka terminal baru dan test dengan curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Get all products
curl http://localhost:3000/api/products

# Get all transactions
curl http://localhost:3000/api/transactions
```

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development dengan auto-reload
npm run dev

# Production
npm start

# Test API
curl http://localhost:3000/api/health
```

## Project Structure

```
SecureKasir-Backend/
├── index.js                          # Entry point
├── package.json                      # Dependencies
├── .env                              # Environment variables
├── .gitignore                        # Git ignore rules
├── README.md                         # Project README
├── API_DOCUMENTATION.md              # API docs
├── DATABASE_SCHEMA.md                # Database docs
├── POSTMAN_COLLECTION.md             # Postman requests
├── SETUP_GUIDE.md                    # Setup guide (file ini)
├── src/
│   ├── config/
│   │   └── db.js                     # Database connection
│   ├── models/
│   │   ├── Product.js                # Product schema
│   │   └── Transaction.js            # Transaction schema
│   ├── controllers/
│   │   ├── productController.js      # Product logic
│   │   └── transactionController.js  # Transaction logic
│   ├── routes/
│   │   ├── products.js               # Product routes
│   │   └── transactions.js           # Transaction routes
│   └── middleware/
│       └── errorHandler.js           # Error handling
└── node_modules/                     # Installed packages
```

## Common Issues & Solutions

### Issue 1: "Cannot find module 'express'"

**Solution:** Run `npm install` first

### Issue 2: MongoDB Connection Error

**Solution:**

- Verify MONGODB_URI in .env file
- Check internet connection
- Verify IP whitelist di MongoDB Atlas (allow all for development)

### Issue 3: Port 3000 Already in Use

**Solution:**

```bash
# Change PORT in .env
PORT=3001

# Or kill the process
lsof -i :3000
kill -9 <PID>
```

### Issue 4: CORS Error dari Frontend

**Solution:** CORS sudah enabled di server untuk semua origins

## MongoDB Atlas Setup (Jika Belum)

1. Login ke MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create atau gunakan cluster yang sudah ada
3. Create database user:
   - Username: `capung_db_user`
   - Password: `Stefani21@`
4. Create database: `securekasir`
5. Whitelist IP:
   - Go to Network Access
   - Add IP Address: 0.0.0.0/0 (allow all for dev)
6. Copy connection string ke .env

## Development Workflow

### 1. Start Server

```bash
npm run dev
```

### 2. Testing dengan cURL

```bash
# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nasi Goreng",
    "price": 25000,
    "category": "Makanan",
    "stock": 50,
    "image": "https://via.placeholder.com/150"
  }'

# Get all products
curl http://localhost:3000/api/products
```

### 3. Testing dengan Postman

- Import collection dari `POSTMAN_COLLECTION.md`
- Update base URL jika perlu
- Start testing endpoints

### 4. View Logs

Server akan menampilkan:

- Requests yang masuk
- Database operations
- Errors dan exceptions

## Monitoring

### Database Monitoring (MongoDB Atlas)

1. Go to Monitoring
2. Check Operation Performance
3. Monitor Connections

### Server Performance

Saat development, monitor:

- Console logs untuk errors
- Response times di Postman
- Database query performance

## Deployment Preparation

Sebelum production, update:

```env
NODE_ENV=production
JWT_SECRET=gunakan_secret_yang_kuat_dan_random
```

Setup recommendations:

1. Use environment-specific .env files
2. Setup PM2 atau similar untuk process management
3. Setup reverse proxy (nginx)
4. Setup SSL/HTTPS
5. Backup MongoDB regularly

## Next Steps

1. ✅ Install dependencies
2. ✅ Setup .env file
3. ✅ Start server (npm run dev)
4. ✅ Test API endpoints
5. Setup frontend integration
6. Add authentication if needed
7. Deploy to production

## Support

Untuk bantuan lebih lanjut:

1. Check API_DOCUMENTATION.md untuk endpoint details
2. Check DATABASE_SCHEMA.md untuk database structure
3. Review console logs untuk error messages
4. Check POSTMAN_COLLECTION.md untuk request examples

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [REST API Best Practices](https://restfulapi.net/)
