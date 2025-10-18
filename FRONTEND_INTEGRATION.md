# Frontend Integration Guide

Guide lengkap untuk mengintegrasikan backend SecureKasir dengan frontend.

## Backend Requirements

Backend sudah running di:

```
http://localhost:3000/api
```

## Frontend Configuration

### Update constant.ts

File: `SecureKasir/src/constant.ts`

```typescript
export const BASE_URL = "http://localhost:3000";
```

Pastikan sudah sesuai dengan backend URL.

### HTTP Client Setup

File: `SecureKasir/src/lib/http.ts` sudah menggunakan axios dengan configuration yang benar.

```typescript
import axios from "axios";
import { BASE_URL } from "../constant";

export const http = axios.create({
  baseURL: BASE_URL + "/api",
});
```

## API Endpoints Mapping

### Products API

#### Get All Products

```typescript
// Frontend
const { data } = await http.get("/products");
const products = data.data; // Array of Product

// Backend Response
{
  "success": true,
  "data": [...],
  "count": 10
}
```

#### Create Product

```typescript
// Frontend
const payload = {
  name: "Nasi Goreng",
  price: 25000,
  category: "Makanan",
  stock: 50,
  image: "https://example.com/image.jpg",
};
const { data } = await http.post("/products", payload);
const newProduct = data.data;
```

#### Update Product

```typescript
// Frontend
const updatedData = {
  name: "Nasi Goreng Premium",
  price: 30000,
  stock: 40,
};
const { data } = await http.put(`/products/${productId}`, updatedData);
```

#### Delete Product

```typescript
// Frontend
await http.delete(`/products/${productId}`);
```

#### Get Categories

```typescript
// Frontend
const { data } = await http.get("/products/categories");
const categories = data.data; // Array of string
```

### Transactions API

#### Get All Transactions

```typescript
// Frontend - dari CartContext
const { data } = await http.get("/transactions?sort=date:desc");
const transactions = data.data.map(normalizeTx);
```

#### Create Transaction

```typescript
// Frontend
const payload = {
  items: [
    {
      productId: "507f1f77bcf86cd799439010",
      name: "Nasi Goreng",
      price: 25000,
      quantity: 2,
      subtotal: 50000,
    },
  ],
  subtotal: 50000,
  discount: 5000,
  total: 45000,
  paymentMethod: "cash",
  cashReceived: 50000,
  change: 5000,
  customerName: "John Doe",
  note: "Pakein sambal",
};

const { data } = await http.post("/transactions", payload);
const transaction = normalizeTx(data.data);
```

#### Delete/Cancel Transaction

```typescript
// Frontend
await http.delete(`/transactions/${transactionId}`);
```

## Important Notes

### Product ID Mapping

- Backend: `_id` (MongoDB ObjectId)
- Frontend: `id` (string)

Mapping function di ProductContext:

```typescript
const rows = (data.data as any[]).map((p) => ({
  id: p._id, // Map _id to id
  name: p.name,
  price: p.price,
  image: p.image,
  category: p.category,
  stock: p.stock,
})) as Product[];
```

### Transaction ID Mapping

- Backend: `_id` (MongoDB ObjectId)
- Frontend: `id` (string)

Mapping function di CartContext:

```typescript
const normalizeTx = (t: any): Transaction => {
  const id = t?._id || t?.id || crypto.randomUUID();

  return {
    id,
    items: Array.isArray(t?.items) ? t.items : [],
    subtotal: safeNumber(t?.subtotal),
    discount: safeNumber(t?.discount),
    total: safeNumber(t?.total),
    date: t?.date ? new Date(t.date).toISOString() : new Date().toISOString(),
    paymentMethod: t?.paymentMethod || "cash",
    cashReceived: safeNumber(t?.cashReceived),
    change: safeNumber(t?.change),
  };
};
```

## Testing Integration

### 1. Test Product Endpoints

```bash
# Terminal 1: Start Backend
cd SecureKasir-Backend
npm run dev

# Terminal 2: Start Frontend
cd SecureKasir
npm run dev

# Terminal 3: Test API
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

### 2. Test via Frontend UI

1. Buka http://localhost:5173
2. Go to Settings page
3. Try Add Product
4. Verify di backend: `curl http://localhost:3000/api/products`

### 3. Test Transaction Flow

1. Buka POS page
2. Add products to cart
3. Complete transaction
4. Check history - verifikasi data disimpan
5. Via backend: `curl http://localhost:3000/api/transactions`

## Common Integration Issues

### Issue 1: CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Backend sudah setup CORS untuk all origins:

```javascript
app.use(cors());
```

### Issue 2: 404 on API Calls

```
GET http://localhost:3000/api/products 404
```

**Solution:** Verify:

1. Backend running di port 3000
2. BASE_URL di constant.ts correct
3. Endpoint path correct

### Issue 3: Product ID Mismatch

Frontend expects `id`, Backend returns `_id`

**Solution:** Mapping sudah di-handle di ProductContext dan CartContext normalization functions.

## Query Parameters Guide

### Products Filtering

```typescript
// Search by name
http.get("/products?search=nasi");

// Filter by category
http.get("/products?category=Makanan");

// Sort by price ascending
http.get("/products?sort=price&order=asc");

// Combine filters
http.get("/products?category=Makanan&search=goreng&sort=price&order=desc");
```

### Transactions Filtering

```typescript
// Sort by newest
http.get("/transactions?sort=date:desc");

// Filter by date range
http.get("/transactions?startDate=2024-01-01&endDate=2024-01-31");

// Filter by payment method
http.get("/transactions?paymentMethod=cash");

// Get today's sales
http.get("/transactions/sales/today");
```

## Data Types Alignment

### Product Type

```typescript
// Frontend (from types/index.ts)
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

// Backend Response (MongoDB)
{
  _id: ObjectId,
  name: string,
  price: number,
  image: string,
  category: string,
  stock: number,
  description?: string,
  sku?: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Type

```typescript
// Frontend (from types/index.ts)
interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
  paymentMethod: string;
  cashReceived: number;
  change: number;
}

// Backend Response (MongoDB)
{
  _id: ObjectId,
  items: [
    {
      productId: ObjectId,
      name: string,
      price: number,
      quantity: number,
      subtotal: number
    }
  ],
  subtotal: number,
  discount: number,
  total: number,
  paymentMethod: "cash" | "qris" | "card",
  cashReceived: number,
  change: number,
  customerName: string,
  note: string,
  status: "completed" | "cancelled" | "pending",
  receiptNumber: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Optimization

### 1. Pagination (Future Enhancement)

```typescript
// Implement pagination query
http.get("/products?page=1&limit=20");
```

### 2. Caching

```typescript
// Use react-query or SWR untuk automatic caching
const { data: products } = useSWR("/api/products", fetcher);
```

### 3. Database Indexes

Backend sudah setup indexes untuk:

- Products: category, name text search, isActive
- Transactions: createdAt, paymentMethod, status, receiptNumber

## Security Considerations

### Current Implementation

- No authentication required (development mode)

### For Production

Add JWT authentication:

1. Setup authentication endpoints
2. Implement JWT tokens
3. Verify tokens in protected routes
4. Add HTTPS/SSL

## Troubleshooting Checklist

- [ ] Backend running di port 3000
- [ ] Frontend running di port 5173
- [ ] BASE_URL di constant.ts = "http://localhost:3000"
- [ ] MONGODB_URI di backend .env correct
- [ ] MongoDB Atlas IP whitelisted
- [ ] No CORS errors di console
- [ ] Product/Transaction data visible di MongoDB
- [ ] API responses contain `success: true`

## Next Steps

1. ✅ Backend running
2. ✅ Frontend setup
3. ✅ Test all endpoints
4. Setup dashboard reports (data visualization)
5. Add search/filter optimization
6. Implement pagination
7. Add authentication for production
