
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__, static_folder='./dist')
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'healingmiraclessecret'

db = SQLAlchemy(app)

# Define models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    image = db.Column(db.String(200))
    rating = db.Column(db.Float, default=0)
    featured = db.Column(db.Boolean, default=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(20), default="processing")
    total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    shipping_address = db.Column(db.Text)
    tracking_number = db.Column(db.String(50))
    
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    product = db.relationship('Product')

# API Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    result = []
    for product in products:
        result.append({
            'id': str(product.id),
            'name': product.name,
            'price': product.price,
            'description': product.description,
            'category': product.category,
            'image': product.image,
            'rating': product.rating,
            'featured': product.featured
        })
    return jsonify(result)

@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        'id': str(product.id),
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'category': product.category,
        'image': product.image,
        'rating': product.rating,
        'featured': product.featured
    })

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    product = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description', ''),
        category=data.get('category', ''),
        image=data.get('image', ''),
        rating=data.get('rating', 0),
        featured=data.get('featured', False)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({
        'id': str(product.id),
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'category': product.category,
        'image': product.image,
        'rating': product.rating,
        'featured': product.featured
    }), 201

@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json
    
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.description = data.get('description', product.description)
    product.category = data.get('category', product.category)
    product.image = data.get('image', product.image)
    product.rating = data.get('rating', product.rating)
    product.featured = data.get('featured', product.featured)
    
    db.session.commit()
    
    return jsonify({
        'id': str(product.id),
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'category': product.category,
        'image': product.image,
        'rating': product.rating,
        'featured': product.featured
    })

@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    result = []
    
    for order in orders:
        items = []
        for item in order.items:
            items.append({
                'id': item.id,
                'product_id': item.product_id,
                'product_name': item.product.name,
                'quantity': item.quantity,
                'price': item.price
            })
            
        result.append({
            'id': str(order.id),
            'order_number': order.order_number,
            'status': order.status,
            'total': order.total,
            'created_at': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'shipping_address': order.shipping_address,
            'tracking_number': order.tracking_number,
            'items': items
        })
        
    return jsonify(result)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    order = Order(
        user_id=data.get('user_id'),
        order_number=f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        total=data['total'],
        status='processing',
        shipping_address=data.get('shipping_address', '')
    )
    
    db.session.add(order)
    db.session.flush()
    
    for item_data in data['items']:
        item = OrderItem(
            order_id=order.id,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        db.session.add(item)
    
    db.session.commit()
    
    return jsonify({
        'id': str(order.id),
        'order_number': order.order_number,
        'status': order.status,
        'total': order.total,
        'created_at': order.created_at.strftime('%Y-%m-%d %H:%M:%S')
    }), 201

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
        
    hashed_password = generate_password_hash(data['password'])
    user = User(
        email=data['email'],
        password=hashed_password,
        is_admin=data.get('is_admin', False)
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'is_admin': user.is_admin
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    return jsonify({
        'id': user.id,
        'email': user.email,
        'is_admin': user.is_admin
    })

# Serve frontend in production mode
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Create admin user and initialize database
@app.before_first_request
def create_tables_and_admin():
    db.create_all()
    
    # Check if admin exists, if not create one
    if not User.query.filter_by(email='admin@example.com').first():
        admin = User(
            email='admin@example.com',
            password=generate_password_hash('admin123'),
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
