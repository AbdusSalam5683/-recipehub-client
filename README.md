# 🍳 RecipeHub - Client Side

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://recipehub-client-six.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, full-featured recipe sharing platform where food enthusiasts can create, share, discover, and manage recipes.

## 🌐 Live Demo

**Live Site:** [https://recipehub-client-six.vercel.app](https://recipehub-client-six.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Authentication](#-authentication)
- [Pages & Routes](#-pages--routes)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🚀 Features

### 🔐 Authentication System
- Email/Password Registration & Login
- Google OAuth Integration
- JWT Authentication with HTTP-Only Cookies
- Protected Routes & Role-Based Access (Admin/User)
- Persistent Login Session

### 👤 User Features
| Feature | Description |
|---------|-------------|
| Dashboard Overview | View total recipes, favorites, likes received |
| Add Recipe | Create recipes with image upload (imgBB) |
| My Recipes | View, Edit, Delete own recipes |
| My Favorites | Save and manage favorite recipes |
| My Purchased Recipes | View all purchased recipes |
| Profile Management | Update name and profile image |
| Premium Membership | Unlock unlimited recipes with Stripe payment |

### 🍽️ Recipe Features
- Browse all recipes with pagination
- Filter recipes by category
- View detailed recipe information
- Like/Unlike recipes
- Favorite/Unfavorite recipes
- Report inappropriate recipes
- Purchase premium recipes via Stripe

### 👑 Admin Features
- **Dashboard Overview**: Total Users, Recipes, Premium Members, Reports
- **Manage Users**: View, Block, Unblock users
- **Manage Recipes**: View, Delete, Feature recipes
- **Reports Management**: Review and handle user reports

### 🎨 UI/UX Features
- Fully responsive design (Mobile, Tablet, Desktop)
- Dark/Light theme toggle
- Smooth animations with Framer Motion
- Professional color palette (Paprika, Sage, Turmeric, Clay)
- Loading skeletons for better UX
- Toast notifications for feedback
- Custom 404 error page

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.10 | React Framework (App Router) |
| **React** | 19.2.4 | UI Library |
| **Tailwind CSS** | 4 | Styling |
| **Framer Motion** | Latest | Animations |
| **Radix UI** | Latest | Accessible Components |
| **Heroicons** | Latest | Icons |
| **Stripe.js** | Latest | Payment Processing |
| **Axios** | Latest | HTTP Client |
| **React Hot Toast** | Latest | Notifications |

### Development Tools
- ESLint
- Prettier
- Turbopack (Next.js 16)

---

## 📁 Project Structure
client/
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ │ └── page.jsx
│ │ │ └── register/
│ │ │ └── page.jsx
│ │ ├── (public)/
│ │ │ ├── page.jsx # Home Page
│ │ │ ├── browse-recipes/
│ │ │ │ └── page.jsx
│ │ │ └── recipe-details/
│ │ │ └── [id]/
│ │ │ └── page.jsx
│ │ ├── (dashboard)/
│ │ │ ├── user-dashboard/
│ │ │ │ ├── page.jsx # Overview
│ │ │ │ ├── add-recipe/
│ │ │ │ ├── my-recipes/
│ │ │ │ ├── my-favorites/
│ │ │ │ ├── purchased/
│ │ │ │ └── profile/
│ │ │ └── admin-dashboard/
│ │ │ ├── page.jsx # Overview
│ │ │ ├── manage-users/
│ │ │ ├── manage-recipes/
│ │ │ └── reports/
│ │ ├── payment/
│ │ │ ├── success/
│ │ │ └── cancel/
│ │ ├── not-found.jsx
│ │ └── layout.jsx
│ ├── components/
│ │ ├── common/
│ │ │ ├── Navbar.jsx
│ │ │ ├── Footer.jsx
│ │ │ ├── Loader.jsx
│ │ │ └── ThemeToggle.jsx
│ │ ├── home/
│ │ │ ├── Banner.jsx
│ │ │ ├── FeaturedRecipes.jsx
│ │ │ └── PopularRecipes.jsx
│ │ └── ui/
│ │ ├── Card.jsx
│ │ └── Modal.jsx
│ ├── contexts/
│ │ └── AuthContext.jsx
│ ├── hooks/
│ │ └── useAuth.js
│ ├── services/
│ │ ├── api.js
│ │ └── auth.js
│ └── lib/
│ ├── utils.js
│ └── constants.js
├── public/
│ └── assets/
│ └── images/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md

text

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://recipehub-server-psi.vercel.app/api

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

npm or yarn

Installation Steps
bash
# 1. Clone the repository
git clone https://github.com/AbdusSalam5683/-recipehub-client.git

# 2. Navigate to project directory
cd -recipehub-client

# 3. Install dependencies
npm install

# 4. Create .env.local file and add environment variables

# 5. Run development server
npm run dev

# 6. Open browser and navigate to
http://localhost:3000
Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm start	Start production server
npm run lint	Run ESLint
🔑 Authentication
Test Credentials
Admin Account
Field	Value
Email	admin@recipehub.com
Password	Admin@123
Regular User
Field	Value
Email	john@example.com
Password	Password@123
Premium User
Field	Value
Email	jane@example.com
Password	Password@123
Stripe Test Card
Field	Value
Card Number	4242 4242 4242 4242
Expiry Date	12/34
CVC	123
📱 Pages & Routes
Public Routes
Route	Description
/	Home Page
/browse-recipes	Browse all recipes
/recipe-details/[id]	Recipe details
/login	Login page
/register	Registration page
Private Routes (User Dashboard)
Route	Description
/user-dashboard	Overview
/user-dashboard/add-recipe	Add new recipe
/user-dashboard/my-recipes	View own recipes
/user-dashboard/my-favorites	View favorites
/user-dashboard/purchased	View purchased recipes
/user-dashboard/profile	Update profile
Private Routes (Admin Dashboard)
Route	Description
/admin-dashboard	Overview
/admin-dashboard/manage-users	Manage users
/admin-dashboard/manage-recipes	Manage recipes
/admin-dashboard/reports	Review reports
Payment Routes
Route	Description
/payment/success	Payment success confirmation
/payment/cancel	Payment cancellation
🎯 Features Implementation Checklist
User Authentication (Email + Google)

JWT with HTTP-Only Cookies

Role-Based Access Control

Recipe CRUD Operations

Image Upload (imgBB)

Stripe Payment Integration

Premium Membership

Admin Dashboard

Dark/Light Theme

Responsive Design

Pagination

Recipe Filtering

Favorites System

Report System

Activity Log

Loading Skeletons

Custom 404 Page

Toast Notifications

Framer Motion Animations

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Commit Guidelines
Use meaningful commit messages

Reference issue numbers when applicable

Keep commits focused on a single change

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📞 Contact
Developer: Abdus Salam

Platform	Link
GitHub	https://github.com/AbdusSalam5683
Email	abdus.salam06111997@gmail.com
Project Client	https://github.com/AbdusSalam5683/-recipehub-client
Project Server	https://github.com/AbdusSalam5683/recipehub-server
🙏 Acknowledgements
Next.js Documentation

Tailwind CSS Documentation

Stripe Documentation

Framer Motion Documentation

React Hot Toast

📊 Project Status
✅ Complete - All features implemented and tested

Metric	Value
Client Commits	35+
Deployment	Vercel
Status	✅ Live
Last Updated: July 6, 2026