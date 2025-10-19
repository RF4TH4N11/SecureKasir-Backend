# Kilogram-Based Product API Documentation

This document describes the API endpoints and usage for selling products by weight (kilogram) in addition to unit-based sales.

## Overview

The system now supports two types of products:
- **Unit products**: Sold by quantity (existing functionality)
- **KG products**: Sold by weight in kilograms (new functionality)

## Product Model Changes

### New Field: `unitType`

```javascript
{
  "unitType": "unit" | "kg"  // Default: "unit"
}
```

- When `unitType === "unit"`: Product sold by quantity (pieces)
- When `unitType === "kg"`: Product sold by weight, `price` represents price per 1 KG

### Example Product (KG-based)

```json
{
  "_id": "6750a1b2c3d4e5f6g7h8i9j0",
  "name": "Telur Ayam Isi 10",
  "price": 30000,
  "unitType": "kg",
  "category": "Telur",
  "stock": 100,
  "image": "https://example.com/telur.jpg",
  "description": "Telur ayam negeri segar",
  "isActive": true
}
```

## Transaction Item Changes

### New Fields

```javascript
{
  "unitType": "unit" | "kg",  // Type of sale
  "weight": Number,            // For kg products (min: 0.1)
  "quantity": Number           // For unit products (min: 1) or equals weight for kg
}
```

### Validation Rules

- **KG products**: Must have `unitType: "kg"` and `weight >= 0.1`
- **Unit products**: Must have `unitType: "unit"` and `quantity >= 1`
- **Subtotal calculation**:
  - KG: `subtotal = weight × price`
  - Unit: `subtotal = quantity × price`

## API Endpoints

### 1. Create KG Product

**POST** `/api/products`

```json
{
  "name": "Telur Ayam Isi 10",
  "price": 30000,
  "unitType": "kg",
  "category": "Telur",
  "stock": 100,
  "image": "https://example.com/telur.jpg",
  "description": "Telur ayam negeri segar"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "...",
    "name": "Telur Ayam Isi 10",
    "price": 30000,
    "unitType": "kg",
    "category": "Telur",
    "stock": 100,
    "image": "https://example.com/telur.jpg",
    "description": "Telur ayam negeri segar",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### 2. Update Product (including unitType)

**PUT** `/api/products/:id`

```json
{
  "unitType": "kg",
  "price": 32000
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { /* updated product */ }
}
```

### 3. Get All Products

**GET** `/api/products`

Returns all products including their `unitType` field.

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Telur Ayam Isi 10",
      "unitType": "kg",
      "price": 30000,
      ...
    },
    {
      "_id": "...",
      "name": "Mie Instan",
      "unitType": "unit",
      "price": 5000,
      ...
    }
  ],
  "count": 2
}
```

### 4. Create Transaction with KG Product

**POST** `/api/transactions`

```json
{
  "items": [
    {
      "productId": "6750a1b2c3d4e5f6g7h8i9j0",
      "unitType": "kg",
      "weight": 2.5,
      "price": 30000
    }
  ],
  "subtotal": 75000,
  "discount": 0,
  "total": 75000,
  "paymentMethod": "cash",
  "cashReceived": 100000,
  "change": 25000,
  "customerName": "Customer"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "...",
    "items": [
      {
        "productId": "6750a1b2c3d4e5f6g7h8i9j0",
        "name": "Telur Ayam Isi 10",
        "price": 30000,
        "unitType": "kg",
        "weight": 2.5,
        "quantity": 2.5,
        "subtotal": 75000,
        "_id": "..."
      }
    ],
    "subtotal": 75000,
    "discount": 0,
    "total": 75000,
    "paymentMethod": "cash",
    "cashReceived": 100000,
    "change": 25000,
    "customerName": "Customer",
    "note": "",
    "status": "completed",
    "receiptNumber": "INV/241215/A1B2",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Create Mixed Transaction (KG + Unit)

**POST** `/api/transactions`

```json
{
  "items": [
    {
      "productId": "TELUR_ID",
      "unitType": "kg",
      "weight": 1.5,
      "price": 30000
    },
    {
      "productId": "MIE_ID",
      "unitType": "unit",
      "quantity": 3,
      "price": 5000
    }
  ],
  "subtotal": 60000,
  "discount": 0,
  "total": 60000,
  "paymentMethod": "cash",
  "cashReceived": 60000,
  "change": 0,
  "customerName": "Customer"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "items": [
      {
        "productId": "TELUR_ID",
        "name": "Telur Ayam Isi 10",
        "price": 30000,
        "unitType": "kg",
        "weight": 1.5,
        "quantity": 1.5,
        "subtotal": 45000
      },
      {
        "productId": "MIE_ID",
        "name": "Mie Instan",
        "price": 5000,
        "unitType": "unit",
        "quantity": 3,
        "subtotal": 15000
      }
    ],
    "total": 60000,
    ...
  }
}
```

## Error Responses

### Missing Weight for KG Product

**Request**:
```json
{
  "items": [
    {
      "productId": "TELUR_ID",
      "unitType": "kg",
      "quantity": 1,  // Should be 'weight'
      "price": 30000
    }
  ],
  ...
}
```

**Response (400)**:
```json
{
  "error": "Item Telur Ayam Isi 10 requires weight >= 0.1 kg"
}
```

### Weight Less Than Minimum

**Request**:
```json
{
  "items": [
    {
      "productId": "TELUR_ID",
      "unitType": "kg",
      "weight": 0.05,  // Less than 0.1
      "price": 30000
    }
  ],
  ...
}
```

**Response (400)**:
```json
{
  "error": "Item Telur Ayam Isi 10 requires weight >= 0.1 kg"
}
```

### Missing Quantity for Unit Product

**Request**:
```json
{
  "items": [
    {
      "productId": "MIE_ID",
      "unitType": "unit",
      "price": 5000
      // Missing quantity
    }
  ],
  ...
}
```

**Response (400)**:
```json
{
  "error": "Item Mie Instan requires quantity >= 1"
}
```

### Insufficient Stock

**Request**:
```json
{
  "items": [
    {
      "productId": "TELUR_ID",
      "unitType": "kg",
      "weight": 150,  // More than available stock
      "price": 30000
    }
  ],
  ...
}
```

**Response (400)**:
```json
{
  "error": "Insufficient stock for product Telur Ayam Isi 10. Available: 100"
}
```

## Stock Management

### For KG Products

- Stock represents available weight in kilograms
- When a transaction is created, stock is reduced by the `weight` amount
- When a transaction is cancelled, stock is restored by the `weight` amount

**Example:**
1. Product created with 100 kg stock
2. Transaction buying 2.5 kg → Stock becomes 97.5 kg
3. Transaction buying 3 kg → Stock becomes 94.5 kg
4. First transaction cancelled → Stock restored to 97 kg

### For Unit Products

- Stock represents available quantity (pieces)
- When a transaction is created, stock is reduced by the `quantity` amount
- When a transaction is cancelled, stock is restored by the `quantity` amount

## Frontend Integration Notes

1. **Product Display**: Show "kg" badge for products with `unitType === "kg"`
2. **Add to Cart**: For kg products, show a weight input modal instead of adding directly
3. **Weight Input**: Accept decimal values (e.g., 0.5, 1, 2.5)
4. **Cart Display**: 
   - KG products: Show "2.5 kg × Rp 30,000/kg = Rp 75,000"
   - Unit products: Show "3 × Rp 5,000 = Rp 15,000"
5. **Receipt**: Format kg items as "X kg × Rp Y/kg = Rp Z"

## Testing Checklist

- [x] Backend: Product model accepts `unitType` field
- [x] Backend: Transaction item validates `weight` for kg products
- [x] Backend: Transaction item validates `quantity` for unit products
- [x] Backend: Subtotal calculated correctly (weight × price for kg)
- [x] Backend: Stock management works for weight-based products
- [x] Backend: Transaction cancellation restores stock correctly
- [ ] Frontend: Products display with kg badge
- [ ] Frontend: Weight input modal for kg products
- [ ] Frontend: Cart shows correct format for kg items
- [ ] Frontend: Receipt displays kg items correctly
- [ ] Integration: Complete transaction flow with mixed products

## Example Use Cases

### Use Case 1: Egg Shop

```javascript
// Create egg product
POST /api/products
{
  "name": "Telur Ayam Kampung",
  "price": 35000,  // Rp 35,000 per kg
  "unitType": "kg",
  "category": "Telur",
  "stock": 50  // 50 kg available
}

// Customer buys 2.3 kg
POST /api/transactions
{
  "items": [{
    "productId": "...",
    "unitType": "kg",
    "weight": 2.3,
    "price": 35000
  }],
  "subtotal": 80500,  // 2.3 × 35000
  "total": 80500,
  ...
}

// Result: Stock becomes 47.7 kg
```

### Use Case 2: Mixed Store

```javascript
// Sell eggs by weight and noodles by unit
POST /api/transactions
{
  "items": [
    {
      "productId": "TELUR_ID",
      "unitType": "kg",
      "weight": 1.8,
      "price": 30000
    },
    {
      "productId": "MIE_ID",
      "unitType": "unit",
      "quantity": 5,
      "price": 5000
    }
  ],
  "subtotal": 79000,  // (1.8 × 30000) + (5 × 5000)
  "total": 79000,
  ...
}
```
