# Shoes_full

back/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controller/
│   │   ├── adminController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── validation/
│   │   ├── adminValidation.js
│   │   ├── productValidation.js
│   │   └── orderValidation.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── uploadImage.js
│   │
│   └── index.js
│
├── image/
│
├── .env
├── .gitignore
├── package.json
└── README.md


frontend/
│
├── public/
│   ├── images/
│   └── favicon.ico
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── ProductCard/
│   │   ├── ProductGrid/
│   │   ├── SearchBar/
│   │   ├── Loader/
│   │   └── ProtectedRoute/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetails/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Profile/
│   │   │
│   │   └── admin/
│   │       ├── Dashboard/
│   │       ├── Products/
│   │       │   ├── ProductList/
│   │       │   ├── AddProduct/
│   │       │   └── EditProduct/
│   │       ├── Orders/
│   │       ├── Users/
│   │       └── Settings/
│   │
│   ├── layouts/
│   │   ├── MainLayout/
│   │   └── AdminLayout/
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── orderService.js
│   │
│   ├── context/
│   │   ├── AuthContext/
│   │   └── CartContext/
│   │
│   ├── hooks/
│   │   ├── useAuth/
│   │   └── useProducts/
│   │
│   ├── routes/
│   │   └── AppRoutes/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .gitignore
├── package.json
└── README.md

//main flow 
USER
 │
 ├── Home
 ├── Products
 ├── Product Details
 ├── Cart
 ├── Checkout
 └── Profile


ADMIN
 │
 └── Admin Dashboard
       │
       ├── Products
       │     ├── Add Product
       │     ├── Edit Product
       │     └── Delete Product
       │
       ├── Orders
       ├── Users
       └── Settings