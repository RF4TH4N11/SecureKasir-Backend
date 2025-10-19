# Kg-Based Product Sales Documentation

## Overview
The system now supports selling products by kilogram (kg) in addition to traditional unit-based sales. This is particularly useful for products like eggs (telur) that are sold by weight.

## Product Model Changes

### New Field: `unitType`
- **Type**: String
- **Enum**: `["unit", "kg"]`
- **Default**: `"unit"`
- **Description**: Determines whether the product is sold by unit or by kilogram

### Example Product Creation

#### Unit-based Product (Default)
```json
POST /api/products
{
  "name": "Indomie",
  "price": 3000,
  "category": "Instant Noodles",
  "stock": 100,
  "image": "indomie.jpg"
}
```

#### Kg-based Product (Telur)
```json
POST /api/products
{
  "name": "Telur Ayam",
  "price": 30000,
  "category": "Groceries",
  "stock": 0,
  "image": "telur.jpg",
  "unitType": "kg"
}
```

## Transaction Model Changes

### New Fields in Transaction Items
- **`weight`**: Number (required when `unitType` is "kg")
- **`unitType`**: String, enum `["unit", "kg"]`, default "unit"
- **`pricePerUnit`**: Number (required) - stores the price per unit or per kg

### Transaction Creation

#### Unit-based Transaction
```json
POST /api/transactions
{
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 3,
      "price": 3000,
      "pricePerUnit": 3000,
      "unitType": "unit"
    }
  ],
  "subtotal": 9000,
  "discount": 0,
  "total": 9000,
  "paymentMethod": "cash",
  "cashReceived": 10000,
  "change": 1000,
  "customerName": "John Doe"
}
```

#### Kg-based Transaction
```json
POST /api/transactions
{
  "items": [
    {
      "productId": "telur_product_id",
      "weight": 2.5,
      "price": 30000,
      "pricePerUnit": 30000,
      "unitType": "kg"
    }
  ],
  "subtotal": 75000,
  "discount": 0,
  "total": 75000,
  "paymentMethod": "cash",
  "cashReceived": 80000,
  "change": 5000,
  "customerName": "Jane Doe"
}
```

#### Mixed Transaction (Unit + Kg)
```json
POST /api/transactions
{
  "items": [
    {
      "productId": "indomie_id",
      "quantity": 3,
      "price": 3000,
      "pricePerUnit": 3000,
      "unitType": "unit"
    },
    {
      "productId": "telur_id",
      "weight": 1.5,
      "price": 30000,
      "pricePerUnit": 30000,
      "unitType": "kg"
    }
  ],
  "subtotal": 54000,
  "discount": 0,
  "total": 54000,
  "paymentMethod": "cash",
  "cashReceived": 60000,
  "change": 6000
}
```

## Calculation Examples

### Kg-based Products
- **1 kg** @ Rp 30,000/kg = **Rp 30,000**
- **2.5 kg** @ Rp 30,000/kg = **Rp 75,000**
- **0.5 kg** @ Rp 30,000/kg = **Rp 15,000**

### Unit-based Products
- **3 units** @ Rp 3,000/unit = **Rp 9,000**
- **10 units** @ Rp 5,000/unit = **Rp 50,000**

## Backend Logic

### Stock Management
- **Unit-based products**: Stock is reduced by the quantity sold
- **Kg-based products**: Stock is NOT automatically reduced (handled separately)

### Validation
- **Unit-based items**: Require `quantity` field (min: 1)
- **Kg-based items**: Require `weight` field (min: > 0)
- Both types require `pricePerUnit` field

### Subtotal Calculation
```javascript
// For kg-based products
subtotal = pricePerUnit × weight

// For unit-based products
subtotal = pricePerUnit × quantity
```

## Backward Compatibility

✅ All existing products without `unitType` will default to `"unit"`
✅ All existing transactions continue to work as before
✅ No breaking changes to existing API endpoints

## Frontend Integration Notes

For the frontend (MugiBerkah-PosKasir), the following changes are needed:

1. **Product List**: Show weight input modal for kg products
2. **Cart**: Display weight instead of quantity for kg items
3. **Receipt**: Format kg items as: `{name} {weight}kg @ Rp {pricePerUnit}/kg = Rp {subtotal}`

See the main issue description for detailed frontend requirements.
