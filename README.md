# SharePlate Connect Architecture Diagram

## 1. Client Applications
```
┌───────────────────────────────────────────────────┐
│               Client Applications                 │
│                                                   │
│  ┌───────────────┐   ┌───────────────────────┐    │
│  │  Web Browser  │   │   Mobile PWA App      │    │
│  └───────────────┘   └───────────────────────┘    │
└───────────────────────────────────────────────────┘
```

## 2. API Gateway
```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        API Gateway                                                 │
│                                                                                                   │
│  ┌─────────────────┐   ┌──────────────────┐   ┌────────────────────┐   ┌──────────────────────┐   │
│  │ RESTful APIs    │   │ Auth Middleware  │   │ Request Validation │   │  Rate Limiting       │   │
│  └─────────────────┘   └──────────────────┘   └────────────────────┘   └──────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 3. Frontend Layer
```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      Frontend Layer                                                │
│                                                                                                   │
│  ┌─────────────────┐   ┌──────────────────┐   ┌────────────────────┐   ┌──────────────────────┐   │
│  │   React.js UI   │   │ PWA Components   │   │ Responsive Design  │   │  Maps Integration    │   │
│  └─────────────────┘   └──────────────────┘   └────────────────────┘   └──────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 4. Backend Services
```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Backend Services                                                │
│                                                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  ┌────────────────────────────┐     │
│  │ User Management│  │ Help Management│  │ Notification    │  │ Matching Algorithm Engine  │     │
│  │ Service        │  │ Service        │  │ Service         │  │                            │     │
│  └────────────────┘  └────────────────┘  └─────────────────┘  └────────────────────────────┘     │
│                                                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐                                     │
│  │ Review & Rating│  │ Credit System  │  │ Analytics       │                                     │
│  │ Service        │  │ Service        │  │ Engine          │                                     │
│  └────────────────┘  └────────────────┘  └─────────────────┘                                     │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 5. Database Layer
```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│      Database Layer            │
│                                │
│  ┌────────────────────┐        │
│  │ PostgreSQL         │        │
│  │ (Relational Data:  │        │
│  │  Users, Help       │        │
│  │  Reviews)          │        │
│  └────────────────────┘        │
│                                │
│  ┌────────────────────┐        │
│  │ MongoDB            │        │
│  │ (Unstructured Data:│        │
│  │  Photos, Feedback) │        │
│  └────────────────────┘        │
│                                │
│  ┌────────────────────┐        │
│  │ Redis              │        │
│  │ (Caching,          │        │
│  │  Real-time Data)   │        │
│  └────────────────────┘        │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 6. External Integrations
```
┌────────────────────────────────────────────┐
│    External Integrations                   │
│                                            │
│  ┌────────────────┐                        │
│  │ Google Maps    │                        │
│  │ API            │                        │
│  └────────────────┘                        │
│                                            │
│  ┌────────────────┐                        │
│  │ SMS Gateway    │                        │
│  │                │                        │
│  └────────────────┘                        │
│                                            │
│  ┌────────────────┐                        │
│  │ Payment Gateway│                        │
│  │                │                        │
│  └────────────────┘                        │
│                                            │
│  ┌────────────────┐                        │
│  │ Social Media   │                        │
│  │ APIs           │                        │
│  └────────────────┘                        │
└────────────────────────────────────────────┘
```

## 7. Hosting & Infrastructure
```
┌────────────────────────────────────────────┐
│   Hosting & Infrastructure                 │
│                                            │
│  ┌────────────────┐                        │
│  │ AWS/Azure      │                        │
│  │ Cloud Hosting  │                        │
│  └────────────────┘                        │
│                                            │
│  ┌────────────────┐                        │
│  │ Kubernetes     │                        │
│  │ Container      │                        │
│  │ Orchestration  │                        │
│  └────────────────┘                        │
│                                            │
│  ┌────────────────┐                        │
│  │ CI/CD Pipeline │                        │
│  │                │                        │
│  └────────────────┘                        │
│                                            │
│  ┌────────────────┐                        │
│  │ Auto-scaling   │                        │
│  │ Infrastructure │                        │
│  └────────────────┘                        │
└────────────────────────────────────────────┘
```
</head>
<body>
  <div class="header">
    <img src="https://assets.livelifegetactive.com/20200221121118/Sharing-food-with-friends.jpg" alt="SharePlate Logo" class="logo">
    <h1>SharePlate</h1>
    <p>Reducing Food Waste, Fighting Hunger</p>
    <div class="meta-info">
      <strong>Last Updated:</strong> 2025-03-26 19:19:22<br>
      <strong>Developed By:</strong> IRONalways17
    </div>
  </div>

  <div class="toc">
    <h3>📋 Table of Contents</h3>
    <ul>
      <li><a href="#overview">Overview</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#screenshots">Screenshots</a></li>
      <li><a href="#tech-stack">Tech Stack</a></li>
      <li><a href="#getting-started">Getting Started</a></li>
      <li><a href="#project-structure">Project Structure</a></li>
      <li><a href="#workflow">Workflow</a></li>
      <li><a href="#api-documentation">API Documentation</a></li>
      <li><a href="#deployment">Deployment</a></li>
      <li><a href="#contributing">Contributing</a></li>
      <li><a href="#license">License</a></li>
    </ul>
  </div>

  <section id="overview">
    <h2>🌟 Overview</h2>
    <p>SharePlate is a platform designed to connect food donors (restaurants, event managers, and individuals) with NGOs to reduce food waste and fight hunger. The application allows donors to list surplus food, which NGOs can then collect and distribute to those in need.</p>
  </section>

  <section id="features">
    <h2>✨ Features</h2>
    <h3>For Food Donors</h3>
    <ul>
      <li>Easy food listing with photo uploads</li>
      <li>Location-based NGO matching</li>
      <li>Donation tracking and history</li>
      <li>Ratings and review system</li>
      <li>Impact statistics and credit system</li>
    </ul>
    <h3>For NGOs</h3>
    <ul>
      <li>Real-time food donation notifications</li>
      <li>Map view of available donations</li>
      <li>Scheduling and pickup confirmation</li>
      <li>Donor ratings and reviews</li>
      <li>Distribution tracking</li>
    </ul>
    <h3>General Features</h3>
    <ul>
      <li>User authentication and profile management</li>
      <li>Real-time notifications</li>
      <li>Interactive food map</li>
      <li>Responsive design for all devices</li>
      <li>Analytics and impact statistics</li>
    </ul>
  </section>

  <section id="screenshots">
    <h2>📸 Screenshots</h2>
    <div class="screenshots">
      <div class="screenshot">
        <img src="https://pbs.twimg.com/media/Gm_oPbQa4AApYnR?format=jpg&name=900x900" alt="Home Page">
        <p>Home Page</p>
      </div>
      <div class="screenshot">
        <img src="https://pbs.twimg.com/media/Gm_op1ia8AAP-zG?format=jpg&name=900x900" alt="Food Map">
        <p>Food Map</p>
      </div>
      <div class="screenshot">
        <img src="https://pbs.twimg.com/media/Gm_o2HSa0AAcI1l?format=jpg&name=900x900" alt="Donation Form">
        <p>Donation Form</p>
      </div>
      <div class="screenshot">
        <img src="https://pbs.twimg.com/media/Gm_qhMzaEAA9Emv?format=jpg&name=900x900" alt="User Dashboard">
        <p>User Dashboard</p>
      </div>
    </div>
  </section>

  <section id="tech-stack">
    <h2>💻 Tech Stack</h2>
    <div class="tech-grid">
      <div class="tech-section">
        <h3>Frontend</h3>
        <ul>
          <li><strong>React.js</strong> - UI library</li>
          <li><strong>React Bootstrap</strong> - Component library for styling</li>
          <li><strong>React Router</strong> - For navigation and routing</li>
          <li><strong>Anime.js</strong> - For animations</li>
          <li><strong>Axios</strong> - HTTP client for API requests</li>
          <li><strong>Socket.io Client</strong> - For real-time features</li>
          <li><strong>Mapbox GL</strong> - For interactive maps</li>
        </ul>
      </div>
      <div class="tech-section">
        <h3>Backend</h3>
        <ul>
          <li><strong>Node.js</strong> - JavaScript runtime</li>
          <li><strong>Express.js</strong> - Web framework</li>
          <li><strong>MongoDB</strong> - Database</li>
          <li><strong>Mongoose</strong> - ODM for MongoDB</li>
          <li><strong>JWT</strong> - Authentication</li>
          <li><strong>Socket.io</strong> - Real-time communication</li>
          <li><strong>Multer</strong> - File uploads</li>
          <li><strong>Nodemailer</strong> - Email notifications</li>
        </ul>
      </div>
      <div class="tech-section">
        <h3>DevOps</h3>
        <ul>
          <li><strong>Git</strong> - Version control</li>
          <li><strong>Render</strong> - Deployment platform</li>
          <li><strong>MongoDB Atlas</strong> - Cloud database</li>
        </ul>
      </div>
    </div>
  </section>
  <section id="getting-started">
    <h2>🚀 Getting Started</h2>
    <h3>Prerequisites</h3>
    <ul>
      <li>Node.js (v16 or above)</li>
      <li>npm or yarn</li>
      <li>MongoDB (local or Atlas connection)</li>
    </ul>
    <h3>Installation</h3>
    <h4>Clone the repository</h4>
    <pre><code>git clone https://github.com/IRONalways17/shareplate.git
cd shareplate</code></pre>
    <h4>Backend Setup</h4>
    <pre><code># Install backend dependencies
      npm install
Set up environment variables - create a .env file with these variables
PORT=5000
MONGO_URI=mongodb://localhost:27017/shareplate
JWT_SECRET=your_jwt_secret
NODE_ENV=development

Start the backend server
npm run dev</code></pre>
    <h4>Frontend Setup</h4>
    <pre><code># Navigate to client directory
cd client
Install frontend dependencies
npm install

Set up environment variables - create a .env file with these variables
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token

Start the frontend development server
npm start</code></pre>
    <p>The application will be available at:</p>
    <ul>
      <li>Frontend: <a href="http://localhost:3000">http://localhost:3000</a></li>
      <li>Backend API: <a href="http://localhost:5000">http://localhost:5000</a></li>
    </ul>
  </section>
  <section id="project-structure">
    <h2>📁 Project Structure</h2>
    <pre><code>shareplate/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   │   ├── img/             # Images and icons
│   │   └── uploads/         # User-uploaded images
│   ├── src/
│   │   ├── assets/          # CSS and other assets
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── common/      # Common/shared components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── food/        # Food-related components
│   │   │   └── layout/      # Layout components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
│
├── models/                  # MongoDB models
├── routes/                  # API routes
├── controllers/             # Route controllers
├── middleware/              # Custom middleware
├── utils/                   # Utility functions
├── config/                  # Configuration files
├── server.js                # Express server entry point
└── package.json             # Backend dependencies</code></pre>
  </section>
  <section id="workflow">
    <h2>🔄 Workflow</h2>
    <h3>User Registration & Authentication</h3>
    <ol>
      <li>Users register as either food donors or NGOs</li>
      <li>Email verification ensures legitimate users</li>
      <li>Login using email/password or social authentication</li>
      <li>JWT-based authentication for secured API access</li>
    </ol>
    <h3>Food Donation Process</h3>
    <ol>
      <li>Donor creates a food listing with details and photos</li>
      <li>System identifies nearby NGOs based on location</li>
      <li>NGOs receive real-time notifications</li>
      <li>NGOs can view and request the food donation</li>
      <li>Donor confirms the NGO's request</li>
      <li>NGO picks up the food and marks it as collected</li>
      <li>Both parties can rate and review each other</li>
    </ol>
    <h3>Notification System</h3>
    <ul>
      <li>Real-time notifications via Socket.io</li>
      <li>Email notifications for important events</li>
      <li>In-app notification center</li>
    </ul>
    <h3>Admin Dashboard</h3>
    <ul>
      <li>User management</li>
      <li>Content moderation</li>
      <li>Analytics and reporting</li>
      <li>System configuration</li>
    </ul>
  </section>
  <section id="api-documentation">
    <h2>📝 API Documentation</h2>
    <h3>Authentication Endpoints</h3>
    <ul>
      <li><code>POST /api/auth/register</code> - Register new user</li>
      <li><code>POST /api/auth/login</code> - User login</li>
      <li><code>GET /api/auth/profile</code> - Get user profile</li>
      <li><code>PUT /api/auth/profile</code> - Update user profile</li>
    </ul>
    <h3>Food Endpoints</h3>
    <ul>
      <li><code>GET /api/food</code> - List all food donations</li>
      <li><code>GET /api/food/:id</code> - Get specific food donation</li>
      <li><code>POST /api/food</code> - Create food donation</li>
      <li><code>PUT /api/food/:id</code> - Update food donation</li>
      <li><code>DELETE /api/food/:id</code> - Delete food donation</li>
    </ul>
    <h3>NGO Endpoints</h3>
    <ul>
      <li><code>GET /api/ngo</code> - List all NGOs</li>
      <li><code>GET /api/ngo/:id</code> - Get specific NGO</li>
      <li><code>POST /api/ngo/request/:foodId</code> - Request food donation</li>
      <li><code>PUT /api/ngo/confirm/:requestId</code> - Confirm food pickup</li>
    </ul>
    <h3>Rating Endpoints</h3>
    <ul>
      <li><code>POST /api/rating</code> - Create rating</li>
      <li><code>GET /api/rating/user/:userId</code> - Get user ratings</li>
    </ul>
  </section>
  <section id="deployment">
    <h2>🌐 Deployment</h2>
    <h3>Deploying to Render</h3>
    <h4>Backend Deployment</h4>
    <ol>
      <li>Create a new Web Service on Render</li>
      <li>Connect your GitHub repository</li>
      <li>Configure the build and start commands:
        <ul>
          <li>Build Command: <code>npm install</code></li>
          <li>Start Command: <code>node server.js</code></li>
        </ul>
      </li>
      <li>Add environment variables in the Render dashboard</li>
      <li>Deploy the service</li>
    </ol>
    <h4>Frontend Deployment</h4>
    <ol>
      <li>Create a new Static Site on Render</li>
      <li>Connect your GitHub repository</li>
      <li>Set the build command: <code>cd client && npm install && npm run build</code></li>
      <li>Set the publish directory: <code>client/build</code></li>
      <li>Add environment variables</li>
      <li>Deploy the static site</li>
    </ol>
  </section>
  <section id="contributing">
    <h2>🤝 Contributing</h2>
    <ol>
      <li>Fork the repository</li>
      <li>Create your feature branch: <code>git checkout -b feature/amazing-feature</code></li>
      <li>Commit your changes: <code>git commit -m 'Add some amazing feature'</code></li>
      <li>Push to the branch: <code>git push origin feature/amazing-feature</code></li>
      <li>Open a pull request</li>
    </ol>
    <h3>Coding Standards</h3>
    <ul>
      <li>Follow ESLint and Prettier configurations</li>
      <li>Write meaningful commit messages</li>
      <li>Maintain test coverage</li>
      <li>Document new features</li>
    </ul>
  </section>
  <section id="license">
    <h2>📄 License</h2>
    <p>This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.</p>
  </section>
  <div class="footer">
    <h3>📞 Contact</h3>
    <p>IRONalways17 - <a href="https://github.com/IRONalways17">GitHub Profile</a></p>
    <p>Project Link: <a href="https://github.com/Aaryanis/shareplate">https://github.com/Aaryanis/shareplate</a></p>
    <hr>
    <p><strong>SharePlate: Because every plate of food deserves to be shared, not wasted.</strong></p>
  </div>
</body>
</html>
