# KitChat - Real-Time Chat Application

KitChat is a modern real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO for real-time communication.

## Features

- 🔐 User authentication (Sign up, Login)
- 💬 Real-time messaging
- 🖼️ Image sharing support
- 👤 User profiles with customizable avatars
- 🎨 Multiple theme options
- 🔴 Online/Offline status
- 📱 Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS with DaisyUI for styling
- Zustand for state management
- Socket.IO client for real-time communication
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT for authentication
- Cloudinary for image storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/allenchristiancustodio/kitchat.git
cd kitchat
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend/kit-chat
npm install

# Install backend dependencies
cd ../../backend
npm install
```

3. Environment Variables

Create a `.env` file in the backend directory:
```env
PORT=5002
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the application

Development mode:
```bash
# Start frontend (in frontend/kit-chat directory)
npm run dev

# Start backend (in backend directory)
npm run dev
```

Production build:
```bash
# In root directory
npm run build
npm start
```

## Deployment

The application is configured for deployment on platforms like Render:

- Build Command: `npm run build`
- Start Command: `npm start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Allen Christian Custodio
- GitHub: [@allenchristiancustodio](https://github.com/allenchristiancustodio)
