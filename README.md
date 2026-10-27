# React-assessment-app
# Mini Product Inventory System

A simple full stack application where users can view products, check their prices and available stock, and purchase products. The application updates the stock after each successful purchase.

## Technologies Used

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **API Testing:** Postman

## Features

- View all available products.
- Display product names, prices, and stock quantities.
- Purchase one item using the Buy button.
- Update product stock after a successful purchase.
- Show success and error messages.
- Prevent purchases when a product is out of stock.
- Validate product names, prices, and stock quantities.
- Protect product creation with an admin API key.
- Handle simultaneous purchases safely using MongoDB atomic updates.

## How It Works

The frontend is built with React. It sends requests to the backend to get product information and purchase items.

The backend uses Express.js to provide API endpoints. Mongoose connects the backend to MongoDB, where product information is stored.

When a user clicks the Buy button, the backend checks whether stock is available. If stock is greater than zero, MongoDB decreases the stock by one.

The stock update is atomic. This means that if two customers try to purchase the last item at the same time, only one purchase can succeed.

Product creation requires an admin API key sent through the `x-admin-api-key` request header.

## Project Structure

```text
mini-product-inventory/
├── client/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── server/
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── products.js
│   ├── middleware/
│   │   └── adminAuth.js
│   ├── server.js
│   ├── seed-products.js
│   └── .env.example
├── .gitignore
└── README.md
```

## Requirements

- Node.js and npm
- A MongoDB Atlas account or a local MongoDB installation
- Postman or another API testing tool

## Setup Instructions

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd mini-product-inventory
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
ADMIN_API_KEY=YOUR_ADMIN_SECRET_KEY
PORT=5000
```

Replace the placeholder values with your own configuration. Never upload your actual `.env` file or secrets to GitHub.

### 3. Start the backend

From the `server` folder, run:

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 4. Start the frontend

Open a second terminal from the project root and run:

```bash
cd client
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

`http://localhost:5173`

Keep both terminals running while using the application.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create a product; requires the admin API key |
| POST | `/api/products/purchase/:id` | Purchase one item |

### Create a Product

Send a `POST` request to:

`http://localhost:5000/api/products`

Add this header:

```text
x-admin-api-key: YOUR_ADMIN_SECRET_KEY
```

Example JSON body:

```json
{
  "name": "Wireless Mouse",
  "price": 1500,
  "stock": 10
}
```

### Purchase a Product

Send a `POST` request to:

`http://localhost:5000/api/products/purchase/PRODUCT_ID`

Replace `PRODUCT_ID` with the product's actual MongoDB ID. No request body is required.

## Testing

The application can be tested using the React interface and Postman.

- Check that products appear on the frontend.
- Purchase an item and verify that stock decreases.
- Try purchasing an out-of-stock product.
- Try creating a product with invalid values.
- Try creating a product without an admin key.
- Test simultaneous requests when only one item remains in stock.

## Environment Variables and Security

Keep `.env` out of Git using `.gitignore`. Provide `.env.example` with placeholder values so other developers know which variables are required.

The admin API key should only be used by trusted administrative clients. Do not put it in React frontend code.

## Future Improvements

- Add product search and category filters.
- Add an admin interface for creating products.
- Improve automated testing.
- Add user authentication and order history.

## Author

Developed as a full-stack technical assessment project using React, Node.js, Express.js, and MongoDB.