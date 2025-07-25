# EQZone - IEM Equalizer Platform

A community-driven web platform for sharing, discovering, and managing IEM (In-Ear Monitor) equalizer presets. Built with Node.js, Express, and MongoDB.

## 🎵 About

EQZone is a platform where audio enthusiasts can:
- **Share and discover** IEM EQ presets
- **Download presets** for their favorite IEMs
- **Upload custom EQ settings** to share with the community
- **Interact with other users** through comments and likes
- **Manage their preset collections** with favorites and personal uploads

## 🚀 Features

### User Features
- **User Registration & Authentication** - Secure account creation and login
- **Browse Presets** - Explore community-uploaded EQ presets
- **Upload Presets** - Share your custom EQ settings
- **Download Presets** - Get EQ files for your devices
- **Like System** - Save and organize favorite presets
- **Comments** - Engage with the community on preset details
- **Personal Dashboard** - Manage your uploads and liked presets
- **Search & Filter** - Find presets by brand, model, or keywords

### Admin Features
- **Admin Dashboard** - Comprehensive platform management
- **User Management** - Monitor and manage user accounts
- **Preset Moderation** - Review and manage uploaded content
- **Platform Analytics** - Track uploads, downloads, and user activity

### Technical Features
- **Responsive Design** - Works on desktop and mobile devices
- **File Upload** - Secure preset file handling with Multer
- **Authentication** - JWT-based user sessions
- **Database** - MongoDB with Mongoose ODM
- **Validation** - Zod schema validation for data integrity

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Zod** - Schema validation

### Frontend
- **EJS** - Template engine
- **CSS** - Custom styling
- **Lucide** - Icon library
- **Vanilla JavaScript** - Client-side functionality

### Development
- **Nodemon** - Development server with auto-reload
- **dotenv** - Environment variable management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sumit4689/EQZone.git
   cd EQZone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=2002
   CONNECTION_STRING=mongodb://localhost:27017/eqzone
   JWT_SECRET=your_jwt_secret_key_here
   ```
   
   ⚠️ **Security Note**: The `.env` file contains sensitive information and is included in `.gitignore` to prevent it from being uploaded to GitHub. Never commit environment files to version control.

4. **Start MongoDB**
   Make sure MongoDB is running on your system or configure MongoDB Atlas connection string.

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:2002/EQZone`

## 📁 Project Structure

```
EQZone/
├── config/
│   └── dbConnection.js          # Database connection configuration
├── controllers/
│   ├── AboutPageController.js   # About page logic
│   ├── adminController.js       # Admin panel functionality
│   ├── homePageController.js    # Home page and file downloads
│   ├── loginController.js       # User authentication
│   ├── logoutController.js      # User logout
│   ├── myFilesController.js     # User file management
│   ├── presetController.js      # Preset details and interactions
│   ├── profilePageController.js # User profile management
│   └── registerController.js    # User registration
├── middleware/
│   ├── adminAuth.js            # Admin authorization
│   └── Authorizations.js       # JWT token verification
├── models/
│   ├── commentModel.js         # Comment schema
│   ├── fileModel.js            # File/Preset schema
│   └── userModel.js            # User schema
├── public/                     # Static assets (CSS files)
├── routes/
│   ├── AboutRoute.js           # About page routes
│   ├── AdminRoute.js           # Admin panel routes
│   ├── EQZoneRoute.js          # Main application routes
│   ├── loginRoute.js           # Authentication routes
│   ├── logoutRoute.js          # Logout routes
│   ├── registerRoute.js        # Registration routes
│   └── UserRoute.js            # User dashboard routes
├── validation/
│   └── userValidationSchema.js # Input validation schemas
├── views/                      # EJS templates
├── server.js                   # Application entry point
└── package.json               # Project dependencies
```

## 🔑 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout

### Main Application
- `GET /EQZone` - Home page with preset listing
- `GET /EQZone/presetDetails/:id` - Preset details page
- `POST /EQZone/like/:presetId` - Like/unlike preset
- `GET /EQZone/download/:fileId` - Download preset file

### User Dashboard
- `GET /User/profilePage` - User profile
- `GET /User/myFiles` - User's uploaded presets
- `GET /User/likedPresets` - User's liked presets
- `GET /User/uploadFile` - Upload preset page
- `POST /User/uploadFile` - Upload new preset
- `DELETE /User/deletePreset/:presetId` - Delete user's preset

### Admin Panel
- `GET /Admin/dashboard` - Admin dashboard
- `GET /Admin/AllPresets` - Manage all presets
- `GET /Admin/uploadPage` - Admin upload page
- `POST /Admin/uploadPreset` - Admin upload preset
- `DELETE /Admin/deleteUser/:userId` - Delete user
- `DELETE /Admin/deletePreset/:presetId` - Delete any preset

## 💾 Database Schema

### User Model
```javascript
{
  name: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  likedPresets: [ObjectId],
  timestamps: true
}
```

### File/Preset Model
```javascript
{
  title: String,
  description: String,
  brand: String,
  model: String,
  fileData: Buffer,
  fileType: String,
  uploadedBy: String,
  downloadCount: Number,
  likeCount: Number,
  comments: [ObjectId],
  likes: [ObjectId],
  createdAt: Date
}
```

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Secure session management
- **Route Protection** - Middleware-based access control
- **Admin Authorization** - Separate admin access levels
- **Input Validation** - Zod schema validation
- **File Upload Security** - Multer configuration for safe file handling
- **Environment Protection** - `.gitignore` prevents sensitive data from being committed to version control

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-friendly interface
- **Modern UI** - Clean and intuitive design
- **Interactive Elements** - Like buttons, modals, and dynamic content
- **Search & Filter** - Easy preset discovery
- **File Management** - Drag-and-drop upload interface

## 🚀 Deployment

### Environment Variables
```env
PORT=2002
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

### Production Considerations
- Use MongoDB Atlas for cloud database
- Set up proper environment variables
- Configure reverse proxy (Nginx)
- Enable HTTPS
- Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Sumit4689**
- GitHub: [@Sumit4689](https://github.com/Sumit4689)

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the GitHub repository
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search with filters
- [ ] Preset categories and tags
- [ ] User rating system
- [ ] API for mobile applications
- [ ] Integration with popular EQ software
- [ ] Bulk preset operations
- [ ] Advanced analytics dashboard

---

**EQZone** - Share your sound, discover new possibilities! 🎵
