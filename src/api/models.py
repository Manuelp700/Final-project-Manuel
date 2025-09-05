from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)

    cart = relationship("Cart", back_populates="user", uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }

class Product(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "stock": self.stock,
            "image_url": self.image_url
        }

class Cart(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), unique=True)
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "items": [i.serialize() for i in self.items]
        }

class CartItem(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    cart_id: Mapped[int] = mapped_column(ForeignKey('cart.id'))
    product_id: Mapped[int] = mapped_column(ForeignKey('product.id'))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")

    def serialize(self):
        return {
            "id": self.id,
            "product": self.product.serialize() if self.product else None,
            "quantity": self.quantity
        }