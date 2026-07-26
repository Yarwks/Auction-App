from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_veiw
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer


@app_veiw(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

