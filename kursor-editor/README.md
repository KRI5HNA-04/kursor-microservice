# 🚀 Kursor - Modern Code Editor

A powerful, web-based code editor built with Next.js 15 that supports multiple programming languages with real-time code execution, user authentication, and code snippet management.

## ✨ Features

### 🎯 Core Features

- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Ruby, Kotlin, Swift, Dart, and Scala
- **Real-time Code Execution**: Run code directly in the browser using Judge0 API
- **Monaco Editor Integration**: VS Code-like editing experience with syntax highlighting
- **Code Templates**: Pre-built templates for quick start in each language
- **Split View**: Side-by-side code editor and output console

### 👤 User Management

- **Authentication**: Secure login/signup with NextAuth.js
- **Google OAuth**: Quick login with Google account
- **User Profiles**: Customizable profiles with bio, social links, and profile pictures
- **Profile Picture Upload**: Secure image upload with compression and validation

### 💾 Code Management

- **Save Code Snippets**: Store your code snippets with titles and descriptions
- **Personal Library**: Access all your saved code from your profile
- **Code History**: Track your coding sessions and progress

### 🎨 Customization

- **Multiple Themes**: Light, Dark, Dracula, and Monokai themes
- **Font Options**: Fira Code, JetBrains Mono, and Source Code Pro
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Analytics & Performance

- **Vercel Analytics**: Track user engagement and page views
- **Speed Insights**: Monitor performance and Core Web Vitals
- **Real-time Monitoring**: Performance optimization with detailed metrics

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Monaco Editor** - VS Code editor component

### Backend & Database

- **NextAuth.js** - Authentication and session management
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database
- **Railway** - Database hosting and deployment

### UI Components

- **Material-UI** - Component library for React
- **Lucide React** - Beautiful icon library
- **React Split** - Resizable split panes
- **React Syntax Highlighter** - Code syntax highlighting

### Deployment & Analytics

- **Vercel** - Frontend hosting and deployment
- **Vercel Analytics** - Web analytics and insights
- **Judge0 API** - Code execution service

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Google OAuth credentials (optional, for Google login)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KRI5HNA-04/Kursor.git
   cd Kursor/kursor-editor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the kursor-editor directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email (for contact form)
   RESEND_API_KEY="your-resend-api-key"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kursor-editor/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── contact/              # Contact form API
│   │   ├── profile/              # Profile management API
│   │   └── saved-code/           # Code snippet API
│   ├── Components/               # Reusable UI components
│   │   ├── ui/                   # Custom UI components
│   │   ├── EditorWithRunner.tsx  # Main code editor
│   │   ├── Navbar.tsx            # Navigation component
│   │   └── ...
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── editor/                   # Code editor page
│   ├── features/                 # Features page
│   ├── login/                    # Login page
│   ├── profile/                  # User profile page
│   ├── signup/                   # Registration page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── public/                       # Static assets
├── lib/                          # Utility functions
└── package.json                  # Dependencies and scripts
```

## 🔧 Configuration

### Database Schema

The application uses the following main models:

- **User**: User accounts with profile information
- **Account**: OAuth account connections
- **Session**: User sessions for authentication
- **SavedCode**: User's saved code snippets

### Supported Languages

- **JavaScript** (Node.js runtime)
- **TypeScript** (TypeScript compiler)
- **Python** (Python 3.x)
- **Java** (OpenJDK)
- **C#** (.NET runtime)
- **C++** (GCC compiler)
- **Go** (Go compiler)
- **Rust** (Rust compiler)
- **PHP** (PHP interpreter)
- **Ruby** (Ruby interpreter)
- **Kotlin** (Kotlin compiler)
- **Swift** (Swift compiler)
- **Dart** (Dart VM)
- **Scala** (Scala compiler)

### Environment Setup

1. **Database**: Set up PostgreSQL database (Railway recommended for production)
2. **Authentication**: Configure Google OAuth in Google Cloud Console
3. **Email**: Set up Resend API for contact form functionality

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with automatic builds on push

### Railway Database Setup

1. Create a Railway account
2. Deploy a PostgreSQL database
3. Copy the DATABASE_URL to your environment variables

## 🔒 Security Features

### Profile Picture Upload Security

- **File Type Validation**: Only JPEG, PNG, GIF, and WebP allowed
- **Size Limits**: Maximum 5MB file size
- **Automatic Compression**: Images compressed to 600px max width
- **Server-side Validation**: Double validation on both client and server
- **Data URL Sanitization**: Secure handling of base64 image data

### Authentication Security

- **Secure Sessions**: JWT-based session management
- **Password Hashing**: bcryptjs for secure password storage
- **CSRF Protection**: Built-in NextAuth.js protection
- **OAuth Integration**: Secure Google OAuth implementation

## 📊 Analytics & Monitoring

- **Vercel Analytics**: Tracks page views, user behavior, and conversion metrics
- **Speed Insights**: Monitors Core Web Vitals and performance
- **Real User Monitoring**: Collects performance data from actual users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **Monaco Editor** - For the VS Code editor experience
- **Judge0** - For code execution API
- **Prisma** - For the excellent ORM

## 📞 Contact

- **GitHub**: [KRI5HNA-04](https://github.com/KRI5HNA-04)
- **Project**: [Kursor Repository](https://github.com/KRI5HNA-04/Kursor)

---

Made with ❤️ by Krishna
