# Postman Collection untuk SecureKasir Backend

Berikut adalah kumpulan request untuk testing API SecureKasir Backend.

## Import ke Postman

1. Copy seluruh JSON di bawah
2. Buka Postman → Import → Raw Text → Paste → Import

## Postman Collection JSON

```json
{
  "info": {
    "name": "SecureKasir Backend",
    "description": "API Collection untuk SecureKasir POS System",
    "version": "1.0.0"
  },
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "PRODUCT_ID",
      "value": ""
    },
    {
      "key": "TRANSACTION_ID",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{BASE_URL}}/../health",
          "host": ["{{BASE_URL}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/products",
              "host": ["{{BASE_URL}}"],
              "path": ["products"],
              "query": [
                {
                  "key": "category",
                  "value": "",
                  "disabled": true
                },
                {
                  "key": "search",
                  "value": "",
                  "disabled": true
                },
                {
                  "key": "sort",
                  "value": "createdAt",
                  "disabled": true
                },
                {
                  "key": "order",
                  "value": "desc",
                  "disabled": true
                }
              ]
            }
          }
        },
        {
          "name": "Get Product By ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/products/{{PRODUCT_ID}}",
              "host": ["{{BASE_URL}}"],
              "path": ["products", "{{PRODUCT_ID}}"]
            }
          }
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Nasi Goreng\",\n  \"price\": 25000,\n  \"category\": \"Makanan\",\n  \"stock\": 50,\n  \"image\": \"https://via.placeholder.com/150\",\n  \"description\": \"Nasi goreng spesial\",\n  \"sku\": \"NG001\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/products",
              "host": ["{{BASE_URL}}"],
              "path": ["products"]
            }
          }
        },
        {
          "name": "Update Product",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Nasi Goreng Premium\",\n  \"price\": 30000,\n  \"stock\": 40\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/products/{{PRODUCT_ID}}",
              "host": ["{{BASE_URL}}"],
              "path": ["products", "{{PRODUCT_ID}}"]
            }
          }
        },
        {
          "name": "Update Product Stock",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"quantity\": 35\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/products/{{PRODUCT_ID}}/stock",
              "host": ["{{BASE_URL}}"],
              "path": ["products", "{{PRODUCT_ID}}", "stock"]
            }
          }
        },
        {
          "name": "Delete Product",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/products/{{PRODUCT_ID}}",
              "host": ["{{BASE_URL}}"],
              "path": ["products", "{{PRODUCT_ID}}"]
            }
          }
        },
        {
          "name": "Get Categories",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/products/categories",
              "host": ["{{BASE_URL}}"],
              "path": ["products", "categories"]
            }
          }
        },
        {
          "name": "Get Products By Category",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/products/category/Makanan",
              "host": ["{{BASE_URL}}"],
              "path": ["products", "category", "Makanan"]
            }
          }
        }
      ]
    },
    {
      "name": "Transactions",
      "item": [
        {
          "name": "Get All Transactions",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/transactions",
              "host": ["{{BASE_URL}}"],
              "path": ["transactions"],
              "query": [
                {
                  "key": "sort",
                  "value": "createdAt",
                  "disabled": true
                },
                {
                  "key": "order",
                  "value": "desc",
                  "disabled": true
                },
                {
                  "key": "status",
                  "value": "completed",
                  "disabled": true
                },
                {
                  "key": "paymentMethod",
                  "value": "cash",
                  "disabled": true
                }
              ]
            }
          }
        },
        {
          "name": "Get Transaction By ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/transactions/{{TRANSACTION_ID}}",
              "host": ["{{BASE_URL}}"],
              "path": ["transactions", "{{TRANSACTION_ID}}"]
            }
          }
        },
        {
          "name": "Create Transaction",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"items\": [\n    {\n      \"productId\": \"PASTE_PRODUCT_ID_HERE\",\n      \"quantity\": 2,\n      \"price\": 25000\n    }\n  ],\n  \"subtotal\": 50000,\n  \"discount\": 5000,\n  \"total\": 45000,\n  \"paymentMethod\": \"cash\",\n  \"cashReceived\": 50000,\n  \"change\": 5000,\n  \"customerName\": \"John Doe\",\n  \"note\": \"Pakein sambal\"\n}"
            },
            "url": {
              "raw": "{{BASE_URL}}/transactions",
              "host": ["{{BASE_URL}}"],
              "path": ["transactions"]
            }
          }
        },
        {
          "name": "Cancel Transaction",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/transactions/{{TRANSACTION_ID}}",
              "host": ["{{BASE_URL}}"],
              "path": ["transactions", "{{TRANSACTION_ID}}"]
            }
          }
        },
        {
          "name": "Get Today's Sales",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/transactions/sales/today",
              "host": ["{{BASE_URL}}"],
              "path": ["transactions", "sales", "today"]
            }
          }
        },
        {
          "name": "Get Transaction Summary",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/transactions/summary/report",
              "host": ["{{BASE_URL}}"],
              "path": ["transactions", "summary", "report"],
              "query": [
                {
                  "key": "startDate",
                  "value": "2024-01-01",
                  "disabled": true
                },
                {
                  "key": "endDate",
                  "value": "2024-01-31",
                  "disabled": true
                }
              ]
            }
          }
        },
        {
          "name": "Get Transaction By Receipt Number",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{BASE_URL}}/transactions/receipt/INV/240115/ABCD",
              "host": ["{{BASE_URL}}"],
              "path": ["transactions", "receipt", "INV/240115/ABCD"]
            }
          }
        }
      ]
    }
  ]
}
```

## Cara Menggunakan

### 1. Setup Collection Variable

Setelah import, buka collection settings dan update:

- `BASE_URL`: `http://localhost:3000/api`

### 2. Testing Products

1. **Create Product** - Catat Product ID dari response
2. Set `PRODUCT_ID` variable dengan ID yang di-catat
3. **Get Product By ID** - Verify produk terbuat
4. **Update Product** - Ubah nama atau harga
5. **Get All Products** - Lihat semua produk
6. **Get Categories** - Lihat kategori yang ada
7. **Delete Product** - Hapus produk

### 3. Testing Transactions

1. **Create Product** terlebih dahulu
2. Catat Product ID
3. **Create Transaction** - Update request body dengan Product ID
4. Catat Transaction ID dari response
5. Set `TRANSACTION_ID` variable dengan ID yang di-catat
6. **Get Transaction By ID** - Verify transaksi
7. **Get Today's Sales** - Lihat penjualan hari ini
8. **Get Transaction Summary** - Lihat ringkasan
9. **Cancel Transaction** - Batalkan transaksi

## Tips & Tricks

1. **Sebelum Create Transaction**: Pastikan Product ID sudah ada
2. **Quantity Check**: Pastikan stock mencukupi
3. **Payment Validation**:
   - Untuk cash: `cashReceived >= total`
   - Untuk QRIS/card: `cashReceived = total`
4. **Date Format**: Gunakan ISO 8601 format untuk date queries
5. **Error Handling**: Baca error message untuk debugging
