import os
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for, flash, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import ImageUploadField
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, logout_user
import razorpay
from wtforms import SelectField
from flask_admin.base import MenuLink
from PIL import Image, ImageOps
from dotenv import load_dotenv

load_dotenv('.env.local')


app = Flask(__name__, static_folder='./dist', template_folder='templates')
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads', 'products')
app.config['RAZORPAY_KEY_ID'] = os.getenv('RAZORPAY_KEY_ID')
app.config['RAZORPAY_KEY_SECRET'] = os.getenv('RAZORPAY_KEY_SECRET')
app.config['FLASK_ADMIN_SWATCH'] = 'materia'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('templates/admin', exist_ok=True)

db = SQLAlchemy(app)
login_manager = LoginManager(app)
razorpay_client = razorpay.Client(auth=(app.config['RAZORPAY_KEY_ID'], app.config['RAZORPAY_KEY_SECRET']))

Image.ANTIALIAS = Image.Resampling.LANCZOS

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    orders = db.relationship('Order', backref='user', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    image_path = db.Column(db.String(200))
    rating = db.Column(db.Float, default=0)
    featured = db.Column(db.Boolean, default=False)
    stock = db.Column(db.Integer, default=10)
    benefits = db.Column(db.Text)
    ingredients = db.Column(db.Text)
    size = db.Column(db.String(50))
    color = db.Column(db.String(50))
    reviews = db.Column(db.Integer, default=0)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(20), default="pending")
    total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    shipping_address = db.Column(db.Text)
    tracking_number = db.Column(db.String(50))
    payment_id = db.Column(db.String(100))
    payment_status = db.Column(db.String(20), default="pending")
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    product = db.relationship('Product')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/uploads/products/<path:filename>')
def serve_product_image(filename):
    uploads_dir = os.path.join(app.root_path, 'static', 'uploads', 'products')
    return send_from_directory(uploads_dir, filename)

class MyAdminIndexView(AdminIndexView):
    @expose('/')
    @login_required
    def index(self):
        if not current_user.is_admin:
            return redirect(url_for('admin_login'))

        stats = {
            'products': Product.query.count(),
            'orders': Order.query.count(),
            'users': User.query.count(),
            'revenue': db.session.query(db.func.sum(Order.total)).scalar() or 0,
            'pending_orders': Order.query.filter_by(status='pending').count()
        }

        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
        popular_products = db.session.query(
            Product.name,
            db.func.sum(OrderItem.quantity).label('total_sold')
        ).join(OrderItem).group_by(Product.id).order_by(db.desc('total_sold')).limit(5).all()

        return self.render('admin/index.html', stats=stats, recent_orders=recent_orders, popular_products=popular_products)

def generate_image_name(obj, file_data):
    ext = file_data.filename.rsplit('.', 1)[-1].lower()
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
    return f"product_{timestamp}.{ext}"

class ProductAdminView(ModelView):
    form_extra_fields = {
        'image_path': ImageUploadField(
            'Product Image',
            base_path=os.path.join(app.root_path, 'static', 'uploads', 'products'),
            url_relative_path='uploads/products/',
            thumbnail_size=(300, 300, True),
            allowed_extensions=['jpg', 'jpeg', 'png', 'gif'],
            namegen=generate_image_name
        )
    }

    form_overrides = {
        'category': SelectField
    }

    form_args = {
        'category': {
            'choices': [
                ('bath', 'Bath'),
                ('gemstone', 'Gemstone'),
                ('tealight', 'Tealight'),
                ('trees', 'Trees')
            ]
        }
    }

    column_list = ['name', 'price', 'category', 'featured', 'rating', 'image_preview', 'stock']
    column_searchable_list = ['name', 'category']
    column_filters = ['price', 'featured', 'category', 'stock']
    column_editable_list = ['price', 'featured', 'rating', 'stock']
    column_formatters = {
        'image_preview': lambda v, c, m, p:
            f'<img src="{url_for("serve_product_image", filename=os.path.basename(m.image_path))}" style="height: 50px;">'
            if m.image_path else ''
    }

    create_modal = True
    edit_modal = True
    can_export = True
    can_view_details = True
    page_size = 20

    def on_model_change(self, form, model, is_created):
        if is_created and not model.image_path:
            model.image_path = None

    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin


class OrderAdminView(ModelView):
    column_list = ['order_number', 'user_id', 'status', 'total', 'created_at', 'payment_status']
    column_labels = {
        'order_number': 'Order #',
        'user_id': 'User ID',
        'status': 'Status',
        'total': 'Total',
        'created_at': 'Date',
        'payment_status': 'Payment'
    }
    column_searchable_list = ['order_number', 'user_id']
    column_filters = ['status', 'payment_status', 'created_at']
    column_editable_list = ['status', 'tracking_number']
    form_choices = {
        'status': [
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('processing', 'Processing'),
            ('shipped', 'Shipped'),
            ('delivered', 'Delivered'),
            ('cancelled', 'Cancelled')
        ]
    }
    can_export = True
    can_view_details = True
    page_size = 20

    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin

class UserAdminView(ModelView):
    column_list = ['email', 'is_admin', 'created_at', 'order_count']
    column_labels = {
        'email': 'Email',
        'is_admin': 'Admin',
        'created_at': 'Joined',
        'order_count': 'Orders'
    }
    column_searchable_list = ['email']
    column_filters = ['is_admin', 'created_at']
    column_editable_list = ['is_admin']
    column_formatters = {
        'created_at': lambda v, c, m, p: m.created_at.strftime('%b %d, %Y'),
        'order_count': lambda v, c, m, p: len(m.orders)
    }
    form_excluded_columns = ['password', 'orders', 'created_at']
    can_export = True
    can_view_details = True
    page_size = 20

    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin

admin = Admin(app, name='Healing Miracles', template_mode='bootstrap4',
              index_view=MyAdminIndexView(url='/admin'))
admin.add_view(ProductAdminView(Product, db.session, name='Products', category='Inventory'))
admin.add_view(OrderAdminView(Order, db.session, name='Orders', category='Sales'))
admin.add_view(UserAdminView(User, db.session, name='Users', category='Management'))

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated and current_user.is_admin:
        return redirect(url_for('admin.index'))

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email, is_admin=True).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('admin.index'))
        flash('Invalid email or password', 'error')
    return render_template('admin/login.html')

@app.route('/admin/logout')
@login_required

def admin_logout():
    logout_user()
    return redirect(url_for('admin_login'))

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    result = []
    for product in products:
        result.append({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'description': product.description,
            'category': product.category,
            'image_url': url_for('serve_product_image', filename=os.path.basename(product.image_path)) if product.image_path else None,
            'rating': product.rating,
            'featured': product.featured,
            'stock': product.stock,
            'benefits': product.benefits,
            'ingredients': product.ingredients,
            'size': product.size,
            'color': product.color,
            'reviews': product.reviews
        })
    return jsonify(result)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'description': product.description,
        'category': product.category,
        'image_url': url_for('serve_product_image', filename=os.path.basename(product.image_path)) if product.image_path else None,
        'rating': product.rating,
        'featured': product.featured,
        'stock': product.stock,
        'benefits': product.benefits,
        'ingredients': product.ingredients,
        'size': product.size,
        'color': product.color,
        'reviews': product.reviews
    })
@app.route('/init-db')
def init_db():
    db.create_all()
    return "Database initialized!"

if __name__ == '__main__':
    app.run(debug=True)
