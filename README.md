# Thanka Web Project - MERN Stack Application

A modern full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, blog post management, and a responsive design.

## Features

- 🔐 **User Authentication**: Secure JWT-based authentication with registration and login
- 📝 **Blog Post Management**: Create, read, update, and delete blog posts
- 👥 **User Profiles**: Customizable user profiles with bio and avatar
- 💬 **Comments & Likes**: Interactive features for post engagement
- 📱 **Responsive Design**: Mobile-friendly interface with modern UI
- 🔒 **Protected Routes**: Secure access to authenticated features
- 🎨 **Modern UI**: Beautiful and intuitive user interface

## Tech Stack

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

### Frontend

- **React.js**: JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Toastify**: Toast notifications
- **Styled Components**: CSS-in-JS styling

## Project Structure

```
thanka_web_project/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── client/                # Frontend React app
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   └── ...
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd thanka_web_project
```

### 2. Install dependencies

#### Install server dependencies

```bash
npm install
```

#### Install client dependencies

```bash
cd client
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/thanka-web-project

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in your `.env` file

## Running the Application

### Development Mode

#### Start the server

```bash
npm run server
```

#### Start the client (in a new terminal)

```bash
npm run client
```

#### Run both server and client concurrently

```bash
npm run dev
```

### Production Mode

#### Build the client

```bash
npm run build
```

#### Start the server

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users` - Delete user account

### Posts

- `GET /api/posts` - Get all published posts
- `GET /api/posts/user` - Get user's posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `PUT /api/posts/like/:id` - Like/unlike a post
- `POST /api/posts/comment/:id` - Add comment to post
- `DELETE /api/posts/comment/:id/:comment_id` - Delete comment

## Available Scripts

- `npm start` - Start the production server
- `npm run server` - Start the development server with nodemon
- `npm run client` - Start the React development server
- `npm run dev` - Run both server and client in development mode
- `npm run build` - Build the React app for production
- `npm run install-client` - Install client dependencies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- React.js team for the amazing framework
- Express.js team for the web framework
- MongoDB team for the database
- All contributors and the open-source community
