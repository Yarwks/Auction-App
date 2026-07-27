from django.shortcuts import render

# Create your views here.
# NOTE: This file is unused dead code - the real product endpoints live in
# products/views.py and are wired up in api/urls.py. Left here fixed (rather
# than deleted) in case it was meant to be used for something else, but it
# currently isn't imported anywhere.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from products.models import Product
from products.serializers import ProductSerializer


@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

