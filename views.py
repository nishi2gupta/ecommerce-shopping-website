
import json
from decimal import Decimal

from django.shortcuts import render, redirect
from .models import Order


# HOME PAGE
def home(request):
    return render(request, 'index.html')


# PRODUCTS PAGE
def products(request):
    return render(request, 'products.html')


# ABOUT PAGE
def about(request):
    return render(request, 'about.html')


# CONTACT PAGE
def contact(request):
    return render(request, 'contact.html')


# CART PAGE
def cart(request):
    return render(request, 'cart.html')


# ORDER PAGE
def order(request):
    return render(request, 'order.html')


# CHECKOUT PAGE
def checkout(request):
    if request.method == "POST":

        name = request.POST.get("name")
        address = request.POST.get("address")
        phone = request.POST.get("phone")
        cart_data = request.POST.get("cart_data")
        total = request.POST.get("total")

        items = json.loads(cart_data)

        Order.objects.create(
            customer_name=name,
            address=address,
            phone=phone,
            items=items,
            total=Decimal(total)
        )

        return redirect('confirmation')

    return render(request, 'checkout.html')


# CONFIRMATION PAGE
def confirmation(request):
    return render(request, 'confirmation.html')
