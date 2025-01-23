# Single Store - E-Commerce API  

A robust backend API for managing an e-commerce platform, built with modern and scalable technologies to ensure seamless performance and security.  

---

## 🛠️ **Technologies Used**
- **Express.js (TypeScript)**: A fast and reliable framework for building server-side applications.  
- **MongoDB**: A NoSQL database to store and manage e-commerce data efficiently.  
- **Prisma**: An ORM for smooth database interactions.  
- **Zod**: Schema validation to ensure reliable and secure data handling.  
- **OAuth**: Secure authentication and authorization system.  
- **Payment Gateway (Midtrans)**: Integrated payment processing for smooth transactions.  

---

## ✨ **Key Features**
1. **Product Management**  
   - Add, update, and delete products.  
   - Manage product categories and stock levels.  

2. **User Authentication & Authorization**  
   - Secure login and registration using OAuth.  
   - Role-based access control (e.g., Admin, User).  

3. **Order Management**  
   - Handle order creation, tracking, and updates.  
   - Manage order status (Pending, Processing, Shipped, Delivered).  

4. **Payment Integration**  
   - Secure payment processing using **Midtrans**.  
   - Real-time payment status updates and notifications.  

5. **Validation & Security**  
   - Data validation using **Zod** to prevent invalid input.  
   - Authentication and token-based security to protect user data.  

6. **Scalable Architecture**  
   - Modular code structure for easier maintenance and scalability.  

---

## 🚀 **Getting Started**

### 1. **Clone the Repository**
```bash
git clone https://github.com/denisetiya/single-store-api.git
cd single-store-api
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Set Up Environment Variables**  
Create a `.env` file in the root directory and configure the following:
```
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/single-store
JWT_SECRET=<your_jwt_secret>
OAUTH_CLIENT_ID=<your_oauth_client_id>
OAUTH_CLIENT_SECRET=<your_oauth_client_secret>
MIDTRANS_CLIENT_KEY=<your_midtrans_client_key>
MIDTRANS_SERVER_KEY=<your_midtrans_server_key>
```

### 4. **Run Database Migrations**
```bash
npx prisma migrate dev
```

### 5. **Start the Development Server**
```bash
npm run dev
```

---



## 🤝 **Contributing**

Contributions are welcome!  
1. Fork the repository.  
2. Create a feature branch: `git checkout -b feature/new-feature`.  
3. Commit your changes: `git commit -m 'Add new feature'`.  
4. Push to the branch: `git push origin feature/new-feature`.  
5. Submit a pull request.  

---

## 📜 **License**
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for more details.  

---
