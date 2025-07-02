# Post Management System

A modern Next.js application for creating, editing, and managing posts with image uploads.

## 🚀 Features

- ✨ Create and edit posts with titles, descriptions, status, and dates
- 🖼️ Image upload functionality with preview
- 🔍 Filter posts by status and date range
- 📱 Responsive design with modern UI
- ⚡ Optimized component structure
- 🎨 Beautiful Tailwind CSS styling

## 📁 Project Structure

```
Alphabin_Test/
├── components/           # Reusable components
│   ├── Layout/          # Layout components
│   │   └── Layout.jsx   # Main layout wrapper
│   ├── UI/              # UI components
│   │   ├── Header.jsx   # Header component
│   │   └── Divider.jsx  # Divider component
│   ├── Forms/           # Form-related components
│   │   └── ImageUpload.jsx
│   ├── Post/            # Post-related components
│   │   ├── PostForm.jsx    # Post creation/editing form
│   │   ├── PostFilters.jsx # Post filtering component
│   │   ├── PostList.jsx    # Posts listing component
│   │   └── PostCard.jsx    # Individual post card
│   └── index.js         # Component exports
├── hooks/               # Custom React hooks
│   └── usePosts.js      # Post management hook
├── lib/                 # Library configurations
│   └── mongodb.js       # MongoDB connection
├── models/              # Database models
│   └── Post.js          # Post model
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   │   ├── posts/       # Posts API endpoints
│   │   └── upload.js    # Image upload endpoint
│   ├── _app.js          # App wrapper
│   ├── _document.js     # Document wrapper
│   └── index.js         # Home page
├── public/              # Static assets
│   └── uploads/         # Uploaded images
├── store/               # State management
│   └── usePostsStore.js # Zustand store
├── styles/              # Styling
│   └── globals.css      # Global CSS
├── utils/               # Utility functions
│   └── helpers.js       # Helper functions
└── package.json         # Dependencies and scripts
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.4 (Pages Router)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **HTTP Client**: Axios

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with your MongoDB connection string:

   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture Improvements

### Before Refactoring

- Single massive 558-line `index.js` file
- All components mixed together
- No separation of concerns
- Poor maintainability

### After Refactoring

- ✅ **Modular Components**: Each UI element has its own component
- ✅ **Custom Hooks**: Business logic extracted to reusable hooks
- ✅ **Proper File Structure**: Organized by feature and responsibility
- ✅ **Reusable Components**: Components can be easily reused
- ✅ **Better Maintainability**: Easy to find and modify specific features
- ✅ **TypeScript Ready**: Structure supports easy TypeScript migration

## 🔧 Component Breakdown

### Layout Components

- **Layout**: Main page wrapper with meta tags and styling
- **Header**: Page title and description

### Form Components

- **ImageUpload**: Handles file selection, preview, and validation
- **PostForm**: Complete form for creating/editing posts

### Post Components

- **PostCard**: Individual post display card
- **PostList**: Container for all posts with empty state
- **PostFilters**: Filter controls for posts

### Custom Hooks

- **usePosts**: Manages all post-related state and operations

## 🎨 UI Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design for all screen sizes
- Intuitive drag-and-drop file upload
- Real-time image preview
- Status indicators with emojis
- Interactive hover effects

## 🔐 API Endpoints

- `GET /api/posts` - Fetch posts with optional filtering
- `POST /api/posts` - Create a new post
- `PUT /api/posts/[id]` - Update a post
- `DELETE /api/posts/[id]` - Delete a post
- `POST /api/upload` - Upload image files

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktops
- 🖥️ Large screens

## 🔄 State Management

Uses Zustand for lightweight state management with the following features:

- Post CRUD operations
- Filter state management
- Automatic data synchronization
- Clean and simple API

## 🚀 Performance Optimizations

- Component-based architecture for better re-rendering
- Optimized image handling
- Efficient state management
- Clean code separation
- Proper error boundaries

---

Made with ❤️ using Next.js and modern React patterns
