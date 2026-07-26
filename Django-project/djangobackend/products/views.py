from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import transaction
from .models import Product, Bid
from .serializers import ProductSerializer, BidSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        products = Product.objects.all()
        for product in products:
            product.check_and_close_auction()
        return Product.objects.all()

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class PlaceBidView(generics.CreateAPIView):
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        
        product.check_and_close_auction()

        if not product.is_active:
            raise serializers.ValidationError("This auction is already over")

        amount = serializer.validated_data['amount']

        with transaction.atomic():
            serializer.save(bidder=self.request.user)
            product.current_price = amount
            product.save()

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'