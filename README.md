# 💰 ExpenSense – Smart Expense Tracker

**ExpenSense** is a full-stack expense tracking application designed to help users manage their finances efficiently. It provides real-time insights into spending habits through interactive dashboards, charts, and smart budget alerts.

---

## 🌐 Live Demo

Access the deployed application:

🔗 https://expensense-set.netlify.app/

---

## 🚀 Features

* 🔐 **Authentication**

  * Secure login and signup using JWT
  * Protected routes for user-specific data

* ➕ **Transaction Management**

  * Add, edit, and delete income & expense records
  * Categorize transactions (Food, Travel, Bills, etc.)

* 📊 **Interactive Dashboard**

  * Visualize data using charts (Pie, Bar, Line)
  * Track total income, expenses, and balance

* 📅 **Monthly Analytics**

  * Compare income vs expenses
  * Track savings and spending trends

* ⚠️ **Budget Alerts**

  * Set category-wise budgets
  * Get notified when limits are exceeded

* 🔍 **Search & Filters**

  * Filter transactions by category, type, and date

* 🎨 **Modern UI/UX**

  * Dark theme with glassmorphism design
  * Fully responsive across devices
  * Smooth animations and clean layout

---

## 🛠️ Tech Stack

**Frontend:**

* React (Vite + TypeScript)
* Tailwind CSS
* Recharts
* Axios
* React Router

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt

---

## 🗄️ Database Schema

### User

* name
* email
* password
* createdAt

### Transaction

* amount
* type (income/expense)
* category
* date
* userId

### Budget

* category
* limit
* userId

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/expensense.git
cd expensense
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file in the backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🚀 Future Enhancements

* AI-based spending insights
* Export reports (PDF/CSV)
* Mobile app version
* Multi-user shared budgets

---

## 💡 Learnings

This project helped me understand:

* Full-stack application development
* Data visualization techniques
* Authentication & security
* Building scalable and clean UI

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📬 Contact

If you have any suggestions or feedback, feel free to connect with me.

---

⭐ If you like this project, don’t forget to star the repo!
