from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from django.db import transaction
from .models import Product, Bid
from .serializers import ProductSerializer, BidSerializer
from .permissions import IsSellerOrReadOnly

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
        product_id = serializer.validated_data['product'].id
        amount = serializer.validated_data['amount']

        with transaction.atomic():
            product = Product.objects.select_for_update().get(pk=product_id)

            product.check_and_close_auction()

            if not product.is_active:
                raise serializers.ValidationError("This auction is already over")

            if amount <= product.current_price:
                raise serializers.ValidationError(
                    f"Bid must be greater than current price of KSh {product.current_price}."
                )

            serializer.save(bidder=self.request.user, product=product)
            product.current_price = amount
            product.save()

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]
    lookup_field = 'pk'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.check_and_close_auction()
        return super().retrieve(request, *args, **kwargs)