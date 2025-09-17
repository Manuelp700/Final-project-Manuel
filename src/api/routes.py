from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from src.api.models import db, User, Product, Cart, CartItem  # <- FIX
import os

api = Blueprint('api', __name__)
CORS(api)


@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "Hola desde backend"}), 200

# Auth


@api.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"msg": "Email y password requeridos"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Usuario ya existe"}), 400
    user = User(email=email, password=generate_password_hash(
        password), is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Registrado"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401
    token = create_access_token(identity=user.id)
    return jsonify(access_token=token, user=user.serialize()), 200


@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({"msg": "No encontrado"}), 404
    return jsonify(user.serialize()), 200


@api.route('/profile', methods=['PUT'])
@jwt_required()
def edit_profile():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({"msg": "No encontrado"}), 404
    data = request.get_json() or {}
    if 'email' in data:
        user.email = data['email']
    if 'password' in data and data['password']:
        user.password = generate_password_hash(data['password'])
    db.session.commit()
    return jsonify({"msg": "Actualizado"}), 200


@api.route('/profile', methods=['DELETE'])
@jwt_required()
def delete_profile():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({"msg": "No encontrado"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Eliminado"}), 200

# Products


@api.route('/products', methods=['GET'])
def list_products():
    return jsonify([p.serialize() for p in Product.query.all()]), 200


@api.route('/products/<int:pid>', methods=['GET'])
def get_product(pid):
    p = Product.query.get(pid)
    if not p:
        return jsonify({"msg": "No existe"}), 404
    return jsonify(p.serialize()), 200


@api.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json() or {}
    if not data.get('name') or data.get('price') is None or data.get('stock') is None:
        return jsonify({"msg": "Campos requeridos: name, price, stock"}), 400
    p = Product(
        name=data['name'],
        description=data.get('description'),
        price=float(data['price']),
        stock=int(data['stock']),
        image_url=data.get('image_url')
    )
    db.session.add(p)
    db.session.commit()
    return jsonify(p.serialize()), 201


@api.route('/products/<int:pid>', methods=['PUT'])
@jwt_required()
def update_product(pid):
    p = Product.query.get(pid)
    if not p:
        return jsonify({"msg": "No existe"}), 404
    data = request.get_json() or {}
    p.name = data.get('name', p.name)
    p.description = data.get('description', p.description)
    p.price = float(data.get('price', p.price))
    p.stock = int(data.get('stock', p.stock))
    p.image_url = data.get('image_url', p.image_url)
    db.session.commit()
    return jsonify(p.serialize()), 200


@api.route('/products/<int:pid>', methods=['DELETE'])
@jwt_required()
def delete_product(pid):
    p = Product.query.get(pid)
    if not p:
        return jsonify({"msg": "No existe"}), 404
    db.session.delete(p)
    db.session.commit()
    return jsonify({"msg": "Producto eliminado"}), 200

# Cart


@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    uid = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=uid).first()
    if not cart:
        cart = Cart(user_id=uid)
        db.session.add(cart)
        db.session.commit()
    return jsonify(cart.serialize()), 200


@api.route('/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    uid = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    if not product_id or quantity < 1:
        return jsonify({"msg": "product_id y quantity válidos"}), 400
    cart = Cart.query.filter_by(user_id=uid).first()
    if not cart:
        cart = Cart(user_id=uid)
        db.session.add(cart)
        db.session.commit()
    item = CartItem.query.filter_by(
        cart_id=cart.id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=product_id,
                        quantity=quantity)
        db.session.add(item)
    db.session.commit()
    return jsonify(cart.serialize()), 200


@api.route('/cart/update', methods=['PUT'])
@jwt_required()
def update_cart_item():
    uid = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    if not product_id or quantity is None or int(quantity) < 1:
        return jsonify({"msg": "product_id y quantity válidos"}), 400
    cart = Cart.query.filter_by(user_id=uid).first()
    if not cart:
        return jsonify({"msg": "Carrito no encontrado"}), 404
    item = CartItem.query.filter_by(
        cart_id=cart.id, product_id=product_id).first()
    if not item:
        return jsonify({"msg": "Item no existe"}), 404
    item.quantity = int(quantity)
    db.session.commit()
    return jsonify(cart.serialize()), 200


@api.route('/cart/remove', methods=['DELETE'])
@jwt_required()
def remove_from_cart():
    uid = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')
    if not product_id:
        return jsonify({"msg": "product_id requerido"}), 400
    cart = Cart.query.filter_by(user_id=uid).first()
    if not cart:
        return jsonify({"msg": "Carrito no encontrado"}), 404
    item = CartItem.query.filter_by(
        cart_id=cart.id, product_id=product_id).first()
    if not item:
        return jsonify({"msg": "Item no existe"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify(cart.serialize()), 200


@api.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    uid = get_jwt_identity()
    cart = Cart.query.filter_by(user_id=uid).first()
    if not cart or len(cart.items) == 0:
        return jsonify({"msg": "Carrito vacío"}), 400

    stripe_key = os.getenv("STRIPE_SECRET_KEY")
    if not stripe_key:
        total = sum(i.product.price *
                    i.quantity for i in cart.items if i.product)
        return jsonify({"msg": "Pago simulado OK", "total": total}), 200

    try:
        import stripe
        stripe.api_key = stripe_key
        line_items = []
        for i in cart.items:
            if not i.product:
                continue
            line_items.append({
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": i.product.name},
                    "unit_amount": int(i.product.price * 100),
                },
                "quantity": i.quantity
            })
        frontend = os.getenv("FRONTEND_URL", "http://localhost:3000")
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            success_url=f"{frontend}/cart?status=success",
            cancel_url=f"{frontend}/cart?status=cancel"
        )
        return jsonify({"checkout_url": session.url}), 200
    except Exception as e:
        return jsonify({"msg": f"Error con pasarela: {str(e)}"}), 500
