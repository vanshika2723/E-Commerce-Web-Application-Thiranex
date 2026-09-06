# 🛒 ShopEase — E-Commerce Web Application

ShopEase is a modern **full-stack e-commerce web application** built using **React.js, Node.js, Express.js, and MongoDB**.

The application provides a complete shopping experience including product browsing, search and filtering, authentication, cart management, checkout, order management, and a dedicated admin dashboard.

---

## 🌟 Highlights

* 🛍️ Complete e-commerce shopping flow
* 🔐 JWT-based authentication
* 👤 Customer and Admin roles
* 📦 Product and inventory management
* 🛒 Shopping cart and checkout
* 📋 Customer order history
* 🚚 Order status tracking
* 👨‍💼 Admin dashboard
* 📊 Revenue and order statistics
* 🔎 Product search and filtering
* 📱 Responsive design
* 🌐 Full-stack REST API

---

## 🚀 Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Secure password hashing with bcrypt
* Product browsing
* Product details
* Search products
* Category filtering
* Price filtering
* Shopping cart
* Add/remove products from cart
* Quantity management
* Checkout
* Shipping address management
* Order creation
* Order history
* Order status tracking
* Logout

### 👨‍💼 Admin Features

* Admin authentication
* Role-based authorization
* Admin dashboard
* Product management
* Add products
* Edit products
* Delete products
* Stock management
* Search products
* Category management
* View all users
* View all orders
* Update order status
* Revenue statistics
* Order statistics
* Inventory statistics
* Analytics dashboard

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Lucide React
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* REST API

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 📁 Project Structure

```text
ShopEase-E-Commerce-Web-App/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminCategories.jsx
│   │   │   └── AdminAnalytics.jsx
│   │   │
│   │   └── services/
│   │       └── api.js
│   │
│   ├── package.json
│   └── .env
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── categoryController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Category.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── categoryRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ShopEase-E-Commerce-Web-App
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔐 Authentication & Authorization

ShopEase uses **JWT authentication** for secure user sessions.

### Roles

```text
Customer
Admin
```

### Customer Protected Routes

```text
/checkout
/confirmation
/orders
```

### Admin Routes

```text
/admin
/admin/products
/admin/orders
/admin/users
/admin/categories
/admin/analytics
```

Admin routes are protected using role-based authorization.

---

## 🛒 E-Commerce Flow

```text
Register / Login
       ↓
Browse Products
       ↓
Search / Filter
       ↓
Product Details
       ↓
Add to Cart
       ↓
Checkout
       ↓
Enter Shipping Address
       ↓
Place Order
       ↓
Order Confirmation
       ↓
Track Order
```

---

## 👨‍💼 Admin Flow

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Manage Products
     ↓
Manage Categories
     ↓
Manage Users
     ↓
Manage Orders
     ↓
Update Order Status
     ↓
View Analytics
```

---

## 📊 Admin Dashboard

The admin dashboard provides a quick overview of the store.

### Dashboard Statistics

* Total Orders
* Total Revenue
* Total Products
* Total Users
* Pending Orders
* Delivered Orders
* Active Orders
* Low Stock Products
* Out of Stock Products
* Recent Orders

---

## 📦 Order Status

Orders can have the following statuses:

```text
Pending
Processing
Shipped
Delivered
Cancelled
```

Admins can update the status of customer orders from the Admin Orders panel.

---

## 🔗 API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/users
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```text
POST /api/orders
GET  /api/orders/my-orders
GET  /api/orders/admin/all
PUT  /api/orders/admin/:id/status
```

### Categories

```text
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

---

## 🔒 Security

* Passwords are hashed using bcryptjs.
* Authentication uses JWT tokens.
* Protected APIs require valid authentication.
* Admin APIs use role-based authorization.
* Sensitive configuration is stored in environment variables.
* `.env` files are excluded from Git.
* Passwords and sensitive reset-token information are not exposed through user listing APIs.

---

## 🌐 Live Demo

### Frontend

**YOUR_VERCEL_URL**

### Backend API

**YOUR_RENDER_URL**

> Replace the above placeholders with your deployed Vercel and Render URLs.

---

## 🖥️ Screenshots

You can add screenshots of your project here:

```text
docs/
├── home.png
├── products.png
├── product-details.png
├── cart.png
├── checkout.png
├── admin-dashboard.png
└── admin-products.png
```

Example:

```md
![ShopEase Home](docs/home.png)
```

---

## 📱 Responsive Design

ShopEase is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

The interface includes responsive navigation, cards, tables, forms, dashboards, and admin panels.

---

## 🔮 Future Improvements

* 💳 Online payment integration
* ⭐ Product reviews and ratings
* ❤️ Wishlist improvements
* 📸 Cloud image upload
* 📧 Email notifications
* 🎟️ Coupon and discount system
* 📊 Advanced analytics
* 🔄 Order cancellation and refunds
* 🔔 Real-time notifications
* 📦 Advanced inventory management

---

## 👩‍💻 Author

### Vanshika Khandelwal

**Full Stack / MERN Stack Developer**



---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.


