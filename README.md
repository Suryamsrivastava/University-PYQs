# Admin Panel - Question Papers & Notes Platform

A Next.js admin panel for managing question papers and notes for educational institutions. This application allows administrators to upload, organize, and manage academic resources with comprehensive filtering capabilities.

## Features

- 🔐 **Secure Authentication**: Hardcoded email/password authentication using environment variables
- 📁 **File Upload**: Upload notes and previous year question papers to Cloudinary
- 🏫 **Comprehensive Metadata**: Store detailed information including college, course, year, branch, semester, and paper type
- 🔍 **Advanced Filtering**: Filter uploaded files by multiple criteria
- 📱 **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- 🗄️ **MongoDB Integration**: Store file metadata in MongoDB database

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudinary
- **Authentication**: Custom hardcoded authentication

## File Types Supported

- PDF documents
- Word documents (DOC, DOCX)
- Excel spreadsheets (XLS, XLSX)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd /path/to/your/project

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Admin credentials (hardcoded for authentication)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# MongoDB configuration
MONGODB_URI=your_mongodb_connection_string
# Example: mongodb://localhost:27017/admin-panel
# Or: mongodb+srv://username:password@cluster.mongodb.net/database

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Next.js configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 3. Database Setup

Ensure MongoDB is running:
- **Local MongoDB**: Start MongoDB service on your machine
- **MongoDB Atlas**: Use your MongoDB Atlas connection string

### 4. Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Update the `.env.local` file with your Cloudinary credentials

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Usage

### 1. Login
- Navigate to the application
- You'll be redirected to the login page
- Use the credentials set in your `.env.local` file

### 2. Upload Files
- Click on "Upload Files" from the dashboard
- Fill in all required fields:
  - College Name
  - Course Name (e.g., B.Tech, BCA, MCA)
  - Year (1st, 2nd, 3rd, 4th)
  - Branch (e.g., CSE, ECE, IT)
  - File Type (Notes or Previous Year Question Paper)
  - Semester (1-8)
  - Paper Type (Normal or Back Paper)
  - Document File

### 3. Manage Files
- Click on "Manage Files" from the dashboard
- Use filters to find specific files:
  - Filter by college name
  - Filter by course name
  - Filter by file type
  - Filter by year, branch, semester
  - Filter by paper type
- View or download files directly from the interface

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/          # Authentication API
│   │   └── files/               # File management APIs
│   ├── dashboard/               # Protected dashboard pages
│   │   ├── files/              # File listing and filtering
│   │   └── upload/             # File upload form
│   ├── login/                  # Login page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx               # Home page (redirects to login)
├── lib/
│   ├── cloudinary.ts           # Cloudinary configuration and utilities
│   ├── mongodb.ts              # MongoDB connection utility
│   └── global.d.ts             # TypeScript global declarations
└── models/
    └── File.ts                 # MongoDB file schema
```

## API Endpoints

- `POST /api/auth/login` - Admin authentication
- `POST /api/files/upload` - Upload new files
- `GET /api/files` - Retrieve files with filtering and pagination

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | `admin123` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/admin-panel` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret key | `your-secret-key` |

## Security Features

- Environment-based authentication credentials
- Protected routes with client-side authentication checks
- Secure file upload to Cloudinary
- Input validation and sanitization

## Next Steps

1. **Configure MongoDB**: Set up your MongoDB database and update the connection string
2. **Set up Cloudinary**: Create your Cloudinary account and add credentials
3. **Customize Authentication**: Update the admin credentials in your `.env.local` file
4. **Test Upload**: Try uploading your first file to ensure everything works
5. **Deploy**: Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Future Enhancements

- Multiple admin users with role-based access
- File editing and deletion capabilities
- Bulk file upload
- Advanced search functionality
- File analytics and reporting
- Email notifications for new uploads

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **Cloudinary Upload Fails**: Verify your Cloudinary credentials are correct
3. **Build Errors**: Run `npm run build` to check for TypeScript errors
4. **Authentication Issues**: Verify your admin credentials in `.env.local`

## Support

For issues and questions, please check the troubleshooting section above or review the code documentation.