# Database Schema Documentation

## Collections Overview

### 1. Products Collection

Stores all product information for the POS system.

**Collection Name:** `products`

**Schema:**

```javascript
{
  _id: ObjectId,
  name: String (required, 3-250 chars),
  price: Number (required, ≥ 0),
  category: String (required),
  stock: Number (required, ≥ 0, default: 0),
  image: String (required, URL format),
  description: String (optional),
  sku: String (optional, unique),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `category`: For filtering by category
- `name`: Text index for searching
- `isActive`: For filtering active products

**Sample Document:**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Nasi Goreng",
  "price": 25000,
  "category": "Makanan",
  "stock": 50,
  "image": "https://example.com/images/nasi-goreng.jpg",
  "description": "Nasi goreng spesial dengan telur dan sayuran",
  "sku": "NG001",
  "isActive": true,
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

---

### 2. Transactions Collection

Stores all transaction records.

**Collection Name:** `transactions`

**Schema:**

```javascript
{
  _id: ObjectId,
  items: [
    {
      _id: ObjectId,
      productId: ObjectId (required, ref: Product),
      name: String (required),
      price: Number (required),
      quantity: Number (required, ≥ 1),
      subtotal: Number (required)
    }
  ],
  subtotal: Number (required, ≥ 0),
  discount: Number (default: 0, ≥ 0),
  total: Number (required, ≥ 0),
  paymentMethod: String (enum: ['cash', 'qris', 'card']),
  cashReceived: Number (required, ≥ 0),
  change: Number (default: 0, ≥ 0),
  customerName: String (default: 'Customer'),
  note: String (optional),
  status: String (enum: ['completed', 'cancelled', 'pending'], default: 'completed'),
  receiptNumber: String (unique, auto-generated),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `createdAt`: For sorting and filtering by date
- `paymentMethod`: For filtering by payment method
- `status`: For filtering by transaction status
- `receiptNumber`: For unique receipt lookup

**Sample Document:**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "items": [
    {
      "_id": ObjectId("507f1f77bcf86cd799439011"),
      "productId": ObjectId("507f1f77bcf86cd799439010"),
      "name": "Nasi Goreng",
      "price": 25000,
      "quantity": 2,
      "subtotal": 50000
    },
    {
      "_id": ObjectId("507f1f77bcf86cd799439014"),
      "productId": ObjectId("507f1f77bcf86cd799439013"),
      "name": "Es Teh",
      "price": 15000,
      "quantity": 1,
      "subtotal": 15000
    }
  ],
  "subtotal": 65000,
  "discount": 5000,
  "total": 60000,
  "paymentMethod": "cash",
  "cashReceived": 70000,
  "change": 10000,
  "customerName": "John Doe",
  "note": "Pakein sambal",
  "status": "completed",
  "receiptNumber": "INV/240115/ABCD",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

---

## Relationships

### Product ↔ Transaction Items

- **One-to-Many**: One product can appear in multiple transactions
- **Foreign Key**: `transactions.items[].productId` → `products._id`
- **Cascade Behavior**:
  - When a transaction is created, product stock is reduced
  - When a transaction is cancelled, product stock is restored
  - Products can be soft-deleted by setting `isActive: false`

---

## Key Business Rules

### Product Management

1. Product names must be 3-250 characters
2. Prices must be non-negative
3. Stock must be non-negative
4. SKU must be unique if provided
5. Inactive products are soft-deleted

### Transaction Processing

1. Stock is automatically deducted when transaction is created
2. Stock is restored if transaction is cancelled
3. Insufficient stock prevents transaction creation
4. Receipt number is auto-generated in format: `INV/YYMMDD/XXXX`
5. Change is calculated: `cashReceived - total` (for cash payments)
6. For QRIS and card, change is always 0

### Data Integrity

1. All prices are stored in IDR (Indonesian Rupiah)
2. No deletion of transactions (only status change to cancelled)
3. Product soft-delete maintains historical reference
4. All monetary values are integers (no decimals)

---

## Database Statistics

### Typical Document Sizes

- Product: ~400-600 bytes
- Transaction: ~800-1200 bytes

### Query Performance Recommendations

1. Use index on `transactions.createdAt` for date range queries
2. Use index on `products.category` for category filtering
3. Use text index on `products.name` for full-text search
4. Consider aggregation for reports on large datasets

---

## Backup Recommendations

1. **Daily Backups**: Backup MongoDB daily
2. **Retention**: Keep backups for at least 30 days
3. **Point-in-Time Recovery**: Enable for production
4. **Test Restores**: Regularly test restore procedures

---

## Migration Guide (If Needed)

### Adding New Field to Products

```javascript
db.products.updateMany({}, { $set: { newField: defaultValue } });
```

### Adding New Field to Transactions

```javascript
db.transactions.updateMany({}, { $set: { newField: defaultValue } });
```

---

## Connection String

```
mongodb+srv://capung_db_user:Stefani21%40@capung.xxfvnno.mongodb.net/securekasir
```

**Database Name:** `securekasir`
**Collections:**

- `products`
- `transactions`
