# QUICK REFERENCE - SecureKasir Backend

## 🚀 Start Server dalam 30 Detik

```bash
cd /Users/mac/Documents/Project/project\ kasir/SecureKasir-Backend
npm install
npm run dev
```

Server akan running di: `http://localhost:3000`

---

## 📍 Folder Location

```
/Users/mac/Documents/Project/project kasir/SecureKasir-Backend
```

---

## 🔗 Important URLs

| URL                                             | Purpose              |
| ----------------------------------------------- | -------------------- |
| `http://localhost:3000/api/health`              | Health check         |
| `http://localhost:3000/api/products`            | Get all products     |
| `http://localhost:3000/api/transactions`        | Get all transactions |
| `http://localhost:3000/api/products/categories` | Get categories       |

---

## 📊 Test Data Creation

### Create a Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nasi Goreng",
    "price": 25000,
    "category": "Makanan",
    "stock": 50,
    "image": "https://via.placeholder.com/150"
  }'
```

### Create a Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "PASTE_PRODUCT_ID_HERE",
        "quantity": 2,
        "price": 25000
      }
    ],
    "subtotal": 50000,
    "discount": 5000,
    "total": 45000,
    "paymentMethod": "cash",
    "cashReceived": 50000,
    "change": 5000,
    "customerName": "John Doe"
  }'
```

---

## 📚 Documentation Files

| File                        | Read If                                  |
| --------------------------- | ---------------------------------------- |
| **API_DOCUMENTATION.md**    | Butuh detail semua endpoint & parameters |
| **DATABASE_SCHEMA.md**      | Ingin understand database structure      |
| **SETUP_GUIDE.md**          | Ada error atau setup issues              |
| **FRONTEND_INTEGRATION.md** | Integrate dengan SecureKasir frontend    |
| **POSTMAN_COLLECTION.md**   | Ingin import ke Postman                  |
| **PROJECT_SUMMARY.md**      | Overview lengkap project                 |

---

## 🛠️ Common Commands

```bash
# Development dengan auto-reload
npm run dev

# Production mode
npm start

# Install dependencies
npm install

# Test health
curl http://localhost:3000/api/health
```

---

## 📋 File Structure Quick View

```
src/
├── config/db.js               # Database connection
├── models/
│   ├── Product.js            # Product schema
│   └── Transaction.js        # Transaction schema
├── controllers/
│   ├── productController.js  # Product logic (8 functions)
│   └── transactionController.js # Transaction logic (7 functions)
├── routes/
│   ├── products.js          # /api/products routes
│   └── transactions.js      # /api/transactions routes
└── middleware/
    └── errorHandler.js      # Error handling
```

---

## 🔑 Key Endpoints

### Products (8 routes)

```
GET    /products              → Get all products
GET    /products/:id          → Get by ID
POST   /products              → Create
PUT    /products/:id          → Update
PATCH  /products/:id/stock    → Update stock
DELETE /products/:id          → Delete
GET    /products/categories   → Get categories
GET    /products/category/:id → Get by category
```

### Transactions (7 routes)

```
GET    /transactions                    → Get all
GET    /transactions/:id                → Get by ID
POST   /transactions                    → Create
DELETE /transactions/:id                → Cancel
GET    /transactions/sales/today        → Today's sales
GET    /transactions/summary/report     → Summary
GET    /transactions/receipt/:number    → Get by receipt
```

---

## 🗄️ Database

**Connection:** MongoDB Atlas  
**Database:** `securekasir`  
**Collections:** `products`, `transactions`  
**URI:** Already in `.env` file

---

## ✨ Features

✅ Product CRUD with soft delete  
✅ Transaction management with auto stock deduction  
✅ Auto-generated receipt numbers  
✅ Flexible filtering & sorting  
✅ Comprehensive error handling  
✅ Date range filtering  
✅ Payment method filtering  
✅ Daily sales summary

---

## 🐛 Quick Troubleshooting

| Problem                  | Solution                                               |
| ------------------------ | ------------------------------------------------------ |
| `npm install` error      | Make sure Node.js v14+ installed                       |
| MongoDB connection error | Check `.env` MONGODB_URI and IP whitelist              |
| Port 3000 in use         | Change PORT in `.env` or `kill -9 $(lsof -t -i :3000)` |
| CORS error               | Restart backend, CORS already enabled                  |
| Product not appearing    | Check if `isActive: true` in database                  |

---

## 📱 Frontend Integration

### Update Frontend constant.ts

```typescript
export const BASE_URL = "http://localhost:3000";
```

Frontend HTTP client already configured correctly in `lib/http.ts`

---

## 🎯 Typical Development Flow

1. **Start Backend**

   ```bash
   npm run dev
   ```

2. **Test via Postman**

   - Import POSTMAN_COLLECTION.md
   - Test endpoints

3. **Verify in MongoDB**

   - Go to MongoDB Atlas
   - Check `securekasir` database
   - View `products` and `transactions` collections

4. **Integrate with Frontend**
   - Start frontend: `npm run dev` in SecureKasir folder
   - Test via UI

---

## 📞 Get Help

1. **API Error?** → Check API_DOCUMENTATION.md
2. **Database Issue?** → Check DATABASE_SCHEMA.md
3. **Setup Problem?** → Check SETUP_GUIDE.md
4. **Frontend Integration?** → Check FRONTEND_INTEGRATION.md
5. **Test API?** → Use POSTMAN_COLLECTION.md

---

## 🚀 Deploy to Production

Before deploying, update `.env`:

```env
NODE_ENV=production
JWT_SECRET=change_to_strong_secret
```

Setup requirements:

- SSL/HTTPS certificate
- Environment-specific .env
- Database backups
- Process manager (PM2)

---

## ✅ Checklist Before Go Live

- [ ] Backend running on production server
- [ ] MongoDB backup automated
- [ ] SSL/HTTPS enabled
- [ ] Environment variables secured
- [ ] Error logging setup
- [ ] Database indexes verified
- [ ] CORS configured for frontend domain
- [ ] Rate limiting considered
- [ ] Monitoring setup (errors, performance)

---

## 📊 Quick Stats

- **Total Routes:** 15 (8 products + 7 transactions)
- **Controllers:** 2 files with 15 total functions
- **Models:** 2 (Product + Transaction)
- **Dependencies:** 7 main packages
- **Middleware:** 1 (Error handler)

---

**Last Updated:** 2024  
**Backend Version:** 1.0.0  
**Node.js:** v14+  
**Database:** MongoDB Atlas
