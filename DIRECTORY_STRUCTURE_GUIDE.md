# 📁 Kursor Project Directory Structure Explained

## 🏗️ **Root Directory: `D:\Kursor\`**

```
D:\Kursor/
├── 📄 .env.local                    # Environment variables for the entire project
├── 📄 COMPLETE_ACCESS_GUIDE.md      # Your comprehensive access guide
├── 📄 package.json                  # Root package configuration
├── 📄 package-lock.json             # Dependency lock file
├── 📁 node_modules/                 # Root-level dependencies
├── 📁 kursor-editor/                # 🌟 FRONTEND - Next.js Application
└── 📁 kursor-microservices/         # 🔧 BACKEND - Microservices Architecture
```

---

## 🌟 **Frontend: `kursor-editor/` Directory**

### **Purpose**: Your main Next.js application (the website users see)

### **Runs on**: http://localhost:3005

```
kursor-editor/
├── 📄 .env                         # Environment variables for frontend
├── 📄 .env.local                   # Local environment overrides
├── 📄 package.json                 # Frontend dependencies & scripts
├── 📄 next.config.ts               # Next.js configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 README.md                    # Frontend documentation
├── 📄 DEPLOY.md                    # Deployment instructions
├── 📁 .next/                       # Next.js build files (auto-generated)
├── 📁 node_modules/                # Frontend dependencies
├── 📁 public/                      # Static assets (images, fonts, etc.)
├── 📁 app/                         # 🎯 MAIN APPLICATION CODE
├── 📁 lib/                         # Utility functions
├── 📁 prisma/                      # Database schema & migrations
├── 📁 generated/                   # Auto-generated files (Prisma client)
└── 📁 types/                       # TypeScript type definitions
```

### **🎯 App Directory (`app/`)** - The Heart of Your Website

```
app/
├── 📄 page.tsx                     # 🏠 HOME PAGE (main landing)
├── 📄 layout.tsx                   # Global layout wrapper
├── 📄 globals.css                  # Global CSS styles
├── 📄 Background.tsx               # Background component
├── 📄 Navbar.tsx                   # Navigation component
├── 📄 favicon.ico                  # Website icon
├── 📁 login/                       # 🔐 LOGIN PAGE
│   └── 📄 page.tsx                 # Login form and logic
├── 📁 signup/                      # ✍️ SIGNUP PAGE
│   └── 📄 page.tsx                 # Registration form
├── 📁 editor/                      # 📝 CODE EDITOR PAGE
│   └── 📄 page.tsx                 # Main code editor interface
├── 📁 profile/                     # 👤 USER PROFILE PAGE
│   └── 📄 page.tsx                 # User profile management
├── 📁 contact/                     # 📧 CONTACT PAGE
│   └── 📄 page.tsx                 # Contact form
├── 📁 about/                       # ℹ️ ABOUT PAGE
│   └── 📄 page.tsx                 # About Kursor information
├── 📁 features/                    # 🌟 FEATURES PAGE
│   └── 📄 page.tsx                 # Platform features showcase
├── 📁 Components/                  # 🧩 REUSABLE COMPONENTS
│   ├── 📄 Hero.tsx                 # Hero section component
│   ├── 📄 Footer.tsx               # Footer component
│   ├── 📄 EditorWithRunner.tsx     # Code editor with execution
│   ├── 📄 CodeSnippet.tsx          # Code snippet display
│   ├── 📄 Navbar.tsx               # Navigation bar
│   └── 📁 ui/                      # UI components library
└── 📁 api/                         # 🔗 API ROUTES (Backend endpoints)
    ├── 📁 auth/                    # Authentication endpoints
    ├── 📁 contact/                 # Contact form handling
    ├── 📁 profile/                 # Profile management
    └── 📁 saved-code/              # Code snippet management
```

### **📁 Public Directory** - Static Assets

```
public/
├── 📄 next.svg                     # Next.js logo
├── 📄 vercel.svg                   # Vercel logo
├── 📄 background_vid.mp4           # Background video
├── 📄 file.svg                     # File icon
├── 📄 globe.svg                    # Globe icon
├── 📄 window.svg                   # Window icon
└── 📁 fonts/                       # Custom fonts
    ├── 📄 Arkhip_font.otf          # Arkhip font (OpenType)
    └── 📄 Arkhip_font.ttf          # Arkhip font (TrueType)
```

---

## 🔧 **Backend: `kursor-microservices/` Directory**

### **Purpose**: Independent microservices handling different functionalities

### **Architecture**: API Gateway + 4 Microservices

```
kursor-microservices/
├── 📄 QUICK_START.md               # Quick start guide for microservices
├── 📄 RUN_PROJECT.md               # Detailed running instructions
├── 📄 start-all-services.ps1       # PowerShell script to start all services
├── 📁 api-gateway/                 # 🌐 MAIN ENTRY POINT (Port 3000)
└── 📁 services/                    # 🔧 INDIVIDUAL MICROSERVICES
    ├── 📁 execution-service/       # ⚡ Code execution (Port 3001)
    ├── 📁 communication-service/   # 📧 Email & notifications (Port 3002)
    ├── 📁 snippet-service/         # 📄 Code snippets (Port 3003)
    └── 📁 user-service/            # 👤 Authentication (Port 3004)
```

### **🌐 API Gateway (`api-gateway/`)** - Traffic Controller

```
api-gateway/
├── 📄 package.json                 # Gateway dependencies
├── 📄 index.js                     # 🎯 MAIN GATEWAY SERVER
├── 📄 .env                         # Gateway environment variables
├── 📄 test.html                    # Interactive testing console
├── 📄 dashboard.html               # Visual service dashboard
└── 📄 README.md                    # Gateway documentation
```

### **⚡ Execution Service (`execution-service/`)** - Code Runner

```
execution-service/
├── 📄 package.json                 # Service dependencies
├── 📄 index.js                     # 🎯 EXECUTION SERVER (Judge0 integration)
├── 📄 .env                         # Service environment variables
├── 📄 test.js                      # Service testing script
└── 📄 README.md                    # Service documentation
```

### **📧 Communication Service (`communication-service/`)** - Email Handler

```
communication-service/
├── 📄 package.json                 # Service dependencies
├── 📄 index.js                     # 🎯 EMAIL SERVER (Resend integration)
├── 📄 .env                         # Service environment variables
├── 📄 test.js                      # Service testing script
└── 📄 README.md                    # Service documentation
```

### **📄 Snippet Service (`snippet-service/`)** - Code Storage

```
snippet-service/
├── 📄 package.json                 # Service dependencies
├── 📄 index.js                     # 🎯 SNIPPET SERVER (CRUD operations)
├── 📄 .env                         # Service environment variables
├── 📄 test.js                      # Service testing script
├── 📄 test.html                    # Interactive testing interface
├── 📄 README.md                    # Service documentation
└── 📁 prisma/                      # Database schema for snippets
```

### **👤 User Service (`user-service/`)** - Authentication

```
user-service/
├── 📄 package.json                 # Service dependencies
├── 📄 index.js                     # 🎯 AUTH SERVER (JWT, bcrypt)
├── 📄 .env                         # Service environment variables
├── 📄 test.js                      # Service testing script
├── 📄 test.html                    # Interactive testing interface
├── 📄 README.md                    # Service documentation
└── 📁 prisma/                      # Database schema for users
```

---

## 🔗 **How Everything Connects**

### **Frontend → Backend Flow**

```
User Browser
    ↓
Frontend (Next.js) - Port 3005
    ↓ (API calls)
API Gateway - Port 3000
    ↓ (Route to appropriate service)
┌─────────────────────────────────────┐
│ Execution Service (3001)            │
│ Communication Service (3002)        │
│ Snippet Service (3003)              │
│ User Service (3004)                 │
└─────────────────────────────────────┘
```

### **Port Allocation**

- **3000**: 🌐 API Gateway (main backend entry)
- **3001**: ⚡ Execution Service (code running)
- **3002**: 📧 Communication Service (emails)
- **3003**: 📄 Snippet Service (code storage)
- **3004**: 👤 User Service (authentication)
- **3005**: 🌟 Frontend (Next.js website)

---

## 📋 **Key Files Explained**

### **Configuration Files**

- **`.env` files**: Store sensitive data (API keys, database URLs)
- **`package.json`**: Define dependencies and scripts for each service
- **`tsconfig.json`**: TypeScript compilation settings
- **`next.config.ts`**: Next.js framework configuration

### **Entry Points**

- **Frontend**: `kursor-editor/app/page.tsx` (Home page)
- **API Gateway**: `api-gateway/index.js` (Main backend entry)
- **Each Service**: `index.js` (Individual service servers)

### **Database**

- **Schema**: `prisma/schema.prisma` (Database structure)
- **Migrations**: `prisma/migrations/` (Database version history)
- **Generated Client**: `generated/prisma/` (Auto-generated database client)

### **Testing & Documentation**

- **`test.html`**: Interactive web interfaces for testing services
- **`test.js`**: Command-line testing scripts
- **`README.md`**: Documentation for each component
- **`COMPLETE_ACCESS_GUIDE.md`**: Your comprehensive usage guide

---

## 🎯 **What Each Directory Does**

### **Frontend (`kursor-editor/`)**

- 🏠 **Displays** the website users see
- 🎨 **Handles** UI, styling, and user interactions
- 📱 **Provides** pages: home, login, editor, contact, etc.
- 🔗 **Connects** to backend via API calls

### **Backend (`kursor-microservices/`)**

- 🌐 **API Gateway**: Routes requests to appropriate services
- ⚡ **Execution**: Runs user code safely
- 📧 **Communication**: Sends emails and notifications
- 📄 **Snippet**: Stores and manages code snippets
- 👤 **User**: Handles authentication and user profiles

### **Shared Resources**

- 🗄️ **Database**: PostgreSQL storing users, snippets, sessions
- 🔑 **Environment Variables**: API keys, secrets, configurations
- 📦 **Dependencies**: Node.js packages for functionality

---

## 🚀 **Development Workflow**

1. **Frontend Changes**: Edit files in `kursor-editor/app/`
2. **Backend Changes**: Edit service files in `kursor-microservices/services/`
3. **Database Changes**: Modify `prisma/schema.prisma` and run migrations
4. **Testing**: Use `test.html` files or visit service endpoints
5. **Monitoring**: Check `dashboard.html` for service health

This structure gives you a **scalable, maintainable** codebase where each part has a specific responsibility! 🎉
