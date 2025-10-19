# Quick Reference: Kg-Based Sales

## Creating Products

### Unit-Based Product (Default)
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Indomie Goreng",
  "price": 3000,
  "category": "Instant Noodles",
  "stock": 100,
  "image": "indomie.jpg"
}
```

### Kg-Based Product (Telur)
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Telur Ayam",
  "price": 30000,
  "category": "Groceries",
  "stock": 0,
  "image": "telur.jpg",
  "unitType": "kg"  # ← Add this field
}
```

## Creating Transactions

### Unit-Based Transaction
```bash
POST /api/transactions
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 3,              # ← Required for unit
      "price": 3000,
      "pricePerUnit": 3000,
      "unitType": "unit"
    }
  ],
  "subtotal": 9000,
  "discount": 0,
  "total": 9000,
  "paymentMethod": "cash",
  "cashReceived": 10000
}
```

### Kg-Based Transaction
```bash
POST /api/transactions
Content-Type: application/json

{
  "items": [
    {
      "productId": "telur_id_here",
      "weight": 2.5,              # ← Required for kg
      "price": 30000,
      "pricePerUnit": 30000,
      "unitType": "kg"
    }
  ],
  "subtotal": 75000,
  "discount": 0,
  "total": 75000,
  "paymentMethod": "cash",
  "cashReceived": 80000
}
```

### Mixed Transaction
```bash
POST /api/transactions
Content-Type: application/json

{
  "items": [
    {
      "productId": "indomie_id",
      "quantity": 3,
      "pricePerUnit": 3000,
      "unitType": "unit"
    },
    {
      "productId": "telur_id",
      "weight": 1.5,
      "pricePerUnit": 30000,
      "unitType": "kg"
    }
  ],
  "subtotal": 54000,
  "total": 54000,
  "paymentMethod": "cash",
  "cashReceived": 60000
}
```

## Calculations

### Unit-Based
```
Subtotal = quantity × pricePerUnit
Example: 3 × Rp 3,000 = Rp 9,000
```

### Kg-Based
```
Subtotal = weight × pricePerUnit
Example: 2.5 kg × Rp 30,000/kg = Rp 75,000
```

## Validation Rules

| Type | Required Field | Min Value | Stock Management |
|------|---------------|-----------|------------------|
| unit | `quantity`    | 1         | Yes (auto)       |
| kg   | `weight`      | > 0       | No               |

## Field Reference

### Product Model
```javascript
{
  name: String,
  price: Number,
  category: String,
  stock: Number,
  image: String,
  unitType: "unit" | "kg"  // Default: "unit"
}
```

### Transaction Item
```javascript
{
  productId: ObjectId,
  name: String,
  price: Number,
  pricePerUnit: Number,
  unitType: "unit" | "kg",
  
  // For unit-based:
  quantity: Number,
  
  // For kg-based:
  weight: Number,
  
  subtotal: Number
}
```

## Common Examples

| Product Type | Weight/Qty | Price/Unit | Subtotal |
|--------------|------------|------------|----------|
| Telur (kg)   | 0.5 kg     | Rp 30,000  | Rp 15,000 |
| Telur (kg)   | 1.0 kg     | Rp 30,000  | Rp 30,000 |
| Telur (kg)   | 2.5 kg     | Rp 30,000  | Rp 75,000 |
| Indomie (unit) | 1 pcs    | Rp 3,000   | Rp 3,000  |
| Indomie (unit) | 5 pcs    | Rp 3,000   | Rp 15,000 |
| Indomie (unit) | 10 pcs   | Rp 3,000   | Rp 30,000 |

## Testing with curl

### Create Kg Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Telur Ayam",
    "price": 30000,
    "category": "Groceries",
    "stock": 0,
    "image": "telur.jpg",
    "unitType": "kg"
  }'
```

### Create Kg Transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "productId": "YOUR_PRODUCT_ID",
      "weight": 2.5,
      "price": 30000,
      "pricePerUnit": 30000,
      "unitType": "kg"
    }],
    "subtotal": 75000,
    "discount": 0,
    "total": 75000,
    "paymentMethod": "cash",
    "cashReceived": 80000
  }'
```

## Need More Info?
- Full docs: `KG_BASED_PRODUCTS.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
