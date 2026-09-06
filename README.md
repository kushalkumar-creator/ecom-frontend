# ShopEasy — E-Commerce Frontend

A full-stack e-commerce web application built with React, connected to a Laravel REST API backend. Built as a selection task assignment — includes customer storefront, cart, checkout, and a complete admin panel.

## Live Demo
- **Frontend:** https://ecom-frontend-pi-mauve.vercel.app
- **Backend API:** https://ecom-backend-production-e275.up.railway.app

## Tech Stack
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- Framer Motion (animations)
- Recharts (admin dashboard charts)
- Lucide React (icons)

## Features

### Customer
- Browse products with search
- Add to cart, adjust quantity
- Checkout with delivery address
- Register / Login (token-based auth)
- View order history ("My Orders")

### Admin
- Dashboard with revenue, order stats, and a 7-day order chart
- Manage Products — add, edit, delete
- Manage Orders — view, accept, reject, mark as delivered

## Getting Started

### 1. Clone and install
```bash
git clone https://github.com/kushalkumar-creator/ecom-frontend.git
cd ecom-frontend
npm install
```

### 2. Configure the API URL
Open `src/api.js` and set the `baseURL` to your backend's URL:
```javascript
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // or your deployed backend URL
});
```

### 3. Run locally
```bash
npm run dev
```
Visit `http://localhost:5173`