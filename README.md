# What Did The Government Do Today? 🏛️

A modern, full-stack web application for tracking congressional bills, legislative actions, and government activities in real-time. Built with React, Express.js, and the official Congress.gov API.

*"Today, the government acted. Here's exactly what they did."*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Express](https://img.shields.io/badge/express-4.21.2-green.svg)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Bill Tracking**: Monitor the latest congressional bills and resolutions
- **Advanced Search**: Search bills by keywords, sponsors, committees, and more
- **Detailed Bill Information**: View comprehensive bill details, actions, sponsors, and summaries
- **Pagination & Filtering**: Efficient browsing with advanced filtering options
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🚀 Technical Features
- **Modern Architecture**: Clean separation between frontend and backend
- **API Caching**: Node-cache based caching for improved performance
- **Error Handling**: Comprehensive error boundaries and validation
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Documentation**: Full API documentation with Swagger
- **State Management**: React Context API for global state
- **Type Safety**: PropTypes and validation throughout

### 📊 Performance
- **Fast Loading**: Optimized with caching and pagination
- **SEO Friendly**: Server-side rendering ready
- **Accessibility**: WCAG compliant components
- **Mobile First**: Responsive design with Tailwind CSS

## 🏗️ Architecture

```
government-tracker/
├── backend/                 # Express.js API server
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── config/            # Configuration files
│   └── server.js          # Entry point
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # Global state management
│   │   └── styles/        # Tailwind CSS styles
│   └── public/            # Static assets
└── docker-compose.yml     # Container orchestration
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- Congress.gov API key ([Get one here](https://api.congress.gov/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/government-tracker.git
   cd government-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Add your Congress.gov API key to backend/.env

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## 🔧 Configuration

### Backend Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# API Keys
CONGRESS_API_KEY=your_congress_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Settings
CACHE_TTL_SECONDS=300
```

### Frontend Environment Variables
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000

# App Configuration
REACT_APP_NAME="What Did The Government Do Today?"
REACT_APP_VERSION=1.0.0
```

## 📡 API Endpoints

### Bills
- `GET /api/congress` - Get recent bills
- `GET /api/congress/actions` - Get congressional actions
- `GET /api/congress/bill/:billSlug` - Get bill details
- `GET /api/congress/bill/:billSlug/summary` - Get bill summary

### Search & Filter
- `GET /api/congress/search` - Search bills
- `GET /api/congress/members` - Get Congress members

### System
- `GET /health` - Health check
- `GET /api-docs` - API documentation

For complete API documentation, visit `/api-docs` when running the server.

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
cd backend && npm test

# Frontend tests only
cd frontend && npm test
```

## 🎨 UI Components

### Core Components
- **BillCard**: Displays bill information in a card format
- **LoadingSpinner**: Animated loading indicator
- **Pagination**: Advanced pagination with page size options
- **ErrorBoundary**: Catches and displays errors gracefully
- **SearchFilters**: Advanced filtering interface

### Pages
- **HomePage**: Dashboard with recent bills and statistics
- **CongressActions**: Paginated list of all congressional actions
- **SearchPage**: Advanced search with multiple filters
- **BillDetailPage**: Comprehensive bill information display

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers
- **Error Handling**: Secure error responses

## 📈 Performance Optimizations

- **Caching**: Node-cache based API response caching
- **Code Splitting**: Dynamic imports for better loading
- **Image Optimization**: Optimized assets
- **Gzip Compression**: Reduced transfer sizes
- **Lazy Loading**: Components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Congress.gov API](https://api.congress.gov/) for providing the data
- [React](https://reactjs.org/) and [Express.js](https://expressjs.com/) communities
- [Tailwind CSS](https://tailwindcss.com/) for the design system

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/government-tracker/issues)
- 📖 Documentation: [API Docs](http://localhost:5000/api-docs)

## 🗺️ Roadmap

- [ ] Real-time notifications for bill updates
- [ ] User accounts and favorites
- [ ] Executive orders tracking
- [ ] Supreme Court decisions
- [ ] Mobile app (React Native)
- [ ] Data visualization dashboard
- [ ] Email/SMS alerts
- [ ] Advanced analytics

---

**whatdidthegovernmentdotoday.org** is a project created to provide clear, unbiased, and easily understandable information about the government's daily actions. The main site consists of a chronological log of government actions, allowing users to view entries from today, this week, or any past date. Users can navigate through daily, weekly, or monthly views to track patterns over time, with filtering options and access via an open API for developers and researchers.

Made with ❤️ for transparency in government