This repository contains the backend API for an Shoora Mall e-commerce application built using Express.js. The API provides various endpoints to manage products, users, orders, and other e-commerce functionalities.

Features
User Authentication & Authorization: Secure login, registration, and role-based access control.
Product Management: CRUD operations for managing product listings.
Order Processing: Order placement, tracking, and management.
Cart Management: Add, update, and remove products in the shopping cart.
Payment Integration: Integration with payment gateways for secure transactions.
Database Management: Efficient data handling with MongoDB.

Technologies Used
Node.js
Express.js
MongoDB with Mongoose
JWT (JSON Web Tokens) for authentication
PhonePe PG API

Getting Started
Prerequisites
Make sure you have the following installed on your system:

Node.js (v14.x or higher)
MongoDB (v4.x or higher)
Installation

Clone the repository:

git clone https://github.com/yourusername/ecommerce-backend.git
cd ecommerce-backend

Install dependencies:

npm install

Environment Variables
Create a .env file in the root directory and add the following environment variables:
DB_URL = mongodb+srv://<username>:<password>@cluster0... (Create a free mongodb database and add URL here)
PORT = 8080
PHONEPE_MERCHANT_ID = PGTESTPAYUAT86
PHONEPE_SALT_KEY = 96434309-7796-489d-8924-ab56988a6076


Running the Application
To start the development server:

npx tsc
npm run dev
The server will run at http://localhost:8080.


License
This project is licensed under the MIT License. See the LICENSE file for more details.

This README file provides a clear structure and helpful information for anyone looking to understand, use, or contribute to your project. Customize the details to match your specific implementation.
