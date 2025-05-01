
# HealinggMiracles E-commerce Project

This project is a clean, minimal, and fully working e-commerce application built with React, Vite, Tailwind CSS, and Flask.

## Features

- Clean and responsive UI built with Tailwind CSS
- Product catalog with search and filtering
- Shopping cart functionality
- Checkout process with payment integration
- User authentication system
- Admin dashboard for product and order management
- Local SQLite database for easy development

## Project Structure

- `/src` - React frontend code
- `/public` - Static assets
- `/app.py` - Flask backend server
- `/instance` - SQLite database location

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+ with pip

### Running the Application Locally

#### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
# or
flask run
```

The Flask server will start at http://localhost:5000.

#### Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:8080.

### Building for Production

```bash
# Build the frontend
npm run build

# Start the Flask server which will serve the built frontend
python app.py
```

## Deploying to Render

This project includes configuration for easy deployment to Render:

1. Create a new Web Service on Render and connect to your repository.
2. Use the Docker runtime or specify Python as the environment.
3. Set the build command to: `pip install -r requirements.txt && npm install && npm run build`
4. Set the start command to: `gunicorn app:app`
5. Add any necessary environment variables.

The included `render.yaml` makes it even easier if you use Render Blueprints.

## Admin Access

After running the application, you can access the admin dashboard at:

- Admin URL: `/admin/products` or `/admin/orders`
- Default admin credentials:
  - Email: admin@example.com
  - Password: admin123

## Project Structure

```
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── render.yaml            # Render configuration
├── Procfile               # For Heroku/Render deployment
├── src/                   # Frontend source code
│   ├── components/        # React components
│   ├── pages/             # React pages
│   ├── services/          # API services
│   └── contexts/          # React contexts (auth, cart, etc.)
└── instance/              # SQLite database (created on first run)
```

## License

This project is licensed under the MIT License.
