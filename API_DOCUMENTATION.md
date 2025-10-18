# SecureKasir Backend API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently no authentication is required. JWT support can be added in the future.

---

## Products Endpoints

### 1. Get All Products

**Endpoint:** `GET /products`

**Query Parameters:**

- `category` (optional) - Filter by category
- `search` (optional) - Search by product name or description
- `sort` (optional) - Sort field: `name`, `price`, `stock`, `createdAt` (default: `createdAt`)
- `order` (optional) - Sort order: `asc`, `desc` (default: `desc`)

**Example Request:**

```bash
curl "http://localhost:3000/api/products?category=Makanan&sort=price&order=asc"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Nasi Goreng",
      "price": 25000,
      "category": "Makanan",
      "stock": 50,
      "image": "https://example.com/image.jpg",
      "description": "Nasi goreng spesial",
      "sku": "NG001",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 2. Get Product By ID

**Endpoint:** `GET /products/:id`

**Example Request:**

```bash
curl "http://localhost:3000/api/products/507f1f77bcf86cd799439011"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nasi Goreng",
    "price": 25000,
    "category": "Makanan",
    "stock": 50,
    "image": "https://example.com/image.jpg",
    "description": "Nasi goreng spesial",
    "sku": "NG001",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Create Product

**Endpoint:** `POST /products`

**Request Body:**

```json
{
  "name": "Nasi Goreng",
  "price": 25000,
  "category": "Makanan",
  "stock": 50,
  "image": "https://example.com/image.jpg",
  "description": "Nasi goreng spesial",
  "sku": "NG001"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nasi Goreng",
    "price": 25000,
    "category": "Makanan",
    "stock": 50,
    "image": "https://example.com/image.jpg",
    "description": "Nasi goreng spesial",
    "sku": "NG001",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4. Update Product

**Endpoint:** `PUT /products/:id`

**Request Body (all fields optional):**

```json
{
  "name": "Nasi Goreng Premium",
  "price": 30000,
  "stock": 40,
  "description": "Nasi goreng dengan protein pilihan"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nasi Goreng Premium",
    "price": 30000,
    "category": "Makanan",
    "stock": 40,
    "image": "https://example.com/image.jpg",
    "description": "Nasi goreng dengan protein pilihan",
    "sku": "NG001",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:40:00Z"
  }
}
```

---

### 5. Update Product Stock

**Endpoint:** `PATCH /products/:id/stock`

**Request Body:**

```json
{
  "quantity": 35
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product stock updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nasi Goreng",
    "price": 25000,
    "stock": 35,
    "category": "Makanan",
    "image": "https://example.com/image.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:45:00Z"
  }
}
```

---

### 6. Delete Product

**Endpoint:** `DELETE /products/:id`

**Response:**

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nasi Goreng",
    "price": 25000,
    "stock": 35,
    "category": "Makanan",
    "image": "https://example.com/image.jpg",
    "isActive": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:50:00Z"
  }
}
```

---

### 7. Get All Categories

**Endpoint:** `GET /products/categories`

**Response:**

```json
{
  "success": true,
  "data": ["Makanan", "Minuman", "Snack"],
  "count": 3
}
```

---

### 8. Get Products By Category

**Endpoint:** `GET /products/category/:category`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Nasi Goreng",
      "price": 25000,
      "category": "Makanan",
      "stock": 50,
      "image": "https://example.com/image.jpg"
    }
  ],
  "count": 1
}
```

---

## Transactions Endpoints

### 1. Get All Transactions

**Endpoint:** `GET /transactions`

**Query Parameters:**

- `sort` (optional) - Sort field: `createdAt`, `total`, `paymentMethod` (default: `createdAt`)
- `order` (optional) - Sort order: `asc`, `desc` (default: `desc`)
- `status` (optional) - Filter by status: `completed`, `cancelled`, `pending`
- `paymentMethod` (optional) - Filter by payment method: `cash`, `qris`, `card`
- `startDate` (optional) - Filter from date (ISO format)
- `endDate` (optional) - Filter until date (ISO format)

**Example Request:**

```bash
curl "http://localhost:3000/api/transactions?paymentMethod=cash&startDate=2024-01-01&endDate=2024-01-31"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "items": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "productId": "507f1f77bcf86cd799439010",
          "name": "Nasi Goreng",
          "price": 25000,
          "quantity": 2,
          "subtotal": 50000
        }
      ],
      "subtotal": 50000,
      "discount": 5000,
      "total": 45000,
      "paymentMethod": "cash",
      "cashReceived": 50000,
      "change": 5000,
      "customerName": "John Doe",
      "note": "Pakein sambal",
      "status": "completed",
      "receiptNumber": "INV/240115/ABCD",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 2. Get Transaction By ID

**Endpoint:** `GET /transactions/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439010",
          "name": "Nasi Goreng",
          "price": 25000,
          "category": "Makanan"
        },
        "name": "Nasi Goreng",
        "price": 25000,
        "quantity": 2,
        "subtotal": 50000
      }
    ],
    "subtotal": 50000,
    "discount": 5000,
    "total": 45000,
    "paymentMethod": "cash",
    "cashReceived": 50000,
    "change": 5000,
    "customerName": "John Doe",
    "note": "Pakein sambal",
    "status": "completed",
    "receiptNumber": "INV/240115/ABCD",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Create Transaction

**Endpoint:** `POST /transactions`

**Request Body:**

```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439010",
      "quantity": 2,
      "price": 25000
    },
    {
      "productId": "507f1f77bcf86cd799439013",
      "quantity": 1,
      "price": 15000
    }
  ],
  "subtotal": 65000,
  "discount": 5000,
  "total": 60000,
  "paymentMethod": "cash",
  "cashReceived": 70000,
  "change": 10000,
  "customerName": "John Doe",
  "note": "Pakein sambal"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "productId": "507f1f77bcf86cd799439010",
        "name": "Nasi Goreng",
        "price": 25000,
        "quantity": 2,
        "subtotal": 50000
      },
      {
        "_id": "507f1f77bcf86cd799439014",
        "productId": "507f1f77bcf86cd799439013",
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
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Important Notes:**

- Product stock is automatically reduced when transaction is created
- Receipt number is auto-generated
- If insufficient stock, the request will fail

---

### 4. Delete/Cancel Transaction

**Endpoint:** `DELETE /transactions/:id`

**Response:**

```json
{
  "success": true,
  "message": "Transaction cancelled and stock restored",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "productId": "507f1f77bcf86cd799439010",
        "name": "Nasi Goreng",
        "price": 25000,
        "quantity": 2,
        "subtotal": 50000
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
    "status": "cancelled",
    "receiptNumber": "INV/240115/ABCD",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

---

### 5. Get Today's Sales

**Endpoint:** `GET /transactions/sales/today`

**Response:**

```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totalSales": 150000,
    "totalTransactions": 5,
    "totalDiscount": 10000,
    "averageTransaction": 30000
  }
}
```

---

### 6. Get Transaction Summary/Report

**Endpoint:** `GET /transactions/summary/report`

**Query Parameters:**

- `startDate` (optional) - From date (ISO format)
- `endDate` (optional) - Until date (ISO format)
- `paymentMethod` (optional) - Filter by payment method

**Example Request:**

```bash
curl "http://localhost:3000/api/transactions/summary/report?startDate=2024-01-01&endDate=2024-01-31"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalTransactions": 50,
    "totalAmount": 2500000,
    "totalDiscount": 100000,
    "totalItems": 150,
    "byPaymentMethod": {
      "cash": 1500000,
      "qris": 800000,
      "card": 200000
    }
  },
  "transactions": 50
}
```

---

### 7. Get Transaction By Receipt Number

**Endpoint:** `GET /transactions/receipt/:receiptNumber`

**Example Request:**

```bash
curl "http://localhost:3000/api/transactions/receipt/INV/240115/ABCD"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439010",
          "name": "Nasi Goreng",
          "price": 25000,
          "category": "Makanan"
        },
        "name": "Nasi Goreng",
        "price": 25000,
        "quantity": 2,
        "subtotal": 50000
      }
    ],
    "subtotal": 50000,
    "discount": 5000,
    "total": 45000,
    "paymentMethod": "cash",
    "cashReceived": 50000,
    "change": 5000,
    "customerName": "John Doe",
    "note": "Pakein sambal",
    "status": "completed",
    "receiptNumber": "INV/240115/ABCD",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Error Responses

### Validation Error

```json
{
  "error": "Validation error",
  "details": [
    "Product name must be at least 3 characters",
    "Product price cannot be negative"
  ]
}
```

### Not Found

```json
{
  "error": "Product not found"
}
```

### Insufficient Stock

```json
{
  "error": "Insufficient stock for product Nasi Goreng. Available: 5"
}
```

### Insufficient Cash

```json
{
  "error": "Cash received must be at least equal to total"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

- All prices are in IDR (Indonesian Rupiah)
- Timestamps are in ISO 8601 format (UTC)
- MongoDB ObjectIds are used for `_id` fields
- Payment methods: `cash`, `qris`, `card`
- Transaction status: `completed`, `cancelled`, `pending`
- Receipt numbers are auto-generated in format: `INV/YYMMDD/XXXX`
