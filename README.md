# SecureKasir Backend

Backend API for SecureKasir POS System built with Express.js and MongoDB.

## Features

- Product Management (CRUD)
- Transaction Management
- Transaction History
- Payment Methods Support (cash, QRIS, card)
- Real-time inventory management
- Discount support
- Receipt generation

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following variables:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://capung_db_user:Stefani21%40@capung.xxfvnno.mongodb.net/securekasir
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

## Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction

## Project Structure

```
src/
├── models/
│   ├── Product.js
│   └── Transaction.js
├── routes/
│   ├── products.js
│   └── transactions.js
├── controllers/
│   ├── productController.js
│   └── transactionController.js
├── middleware/
│   └── errorHandler.js
└── config/
    └── db.js
```

## License

ISC
