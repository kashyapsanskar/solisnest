  # SolisNest - Marketplace Application

## Overview

SolisNest is a **simplified marketplace application** built using the **ERN stack (Express.js, React, Node.js)** that allows users to **browse products, list items for sale, and place orders**. It also includes a **mobile-friendly Glide companion app** for product and order management, integrated with **Airtable** as the database.

## 🚀 Live Demo

- **Web App (Deployed on Vercel)**: [SolisNest Marketplace](https://solisnest-new-git-main-sanskar-kashyaps-projects.vercel.app/)
- **Glide Companion App**: [SolisNest Mobile](https://solisnest-s254.glide.page/)
- **Project Walkthrough Video**: [Watch Here](https://drive.google.com/file/d/1Scj-_B1WYHk0SmG7AavIiYPljRSC1ePx/view?usp=sharing)

## 🛠 Tech Stack

- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, Airtable
- **Database**: Airtable (for products & orders storage)
- **Mobile Companion App**: Glide (integrated with Airtable)
- **Deployment**: Vercel (Frontend), Glide (Mobile)

---

## 🌟 Features

### ✅ Web Application (ERN Stack)
- **Authentication**: User registration, login, and logout.
- **Product Listings**:
  - Browse, search, add, edit, and delete products.
- **Order Placement**:
  - Users can place and track orders.
- **API Integration**:
  - REST APIs for products & orders using Express.js.
  - Data persistence with Airtable.

### ✅ Glide Companion App
- **Products Management**:
  - Users can add, edit, delete, and view only their products.
- **Orders Management**:
  - Users can view orders placed and received.
- **Basic Analytics**:
  - Displays key metrics like total products listed and orders received.
- **Real-time Sync**:
  - Seamless integration with Airtable.

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kashyapsanskar/solisnest.git
cd solisnest
```
## Install Dependencies
```bash
npm install
```
## Set Up Environmental Variables
```bash
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
PORT=5000
```
## Start the Development Server
```bash
npm run dev
```
##The app should now be running at http://localhost:3000.


