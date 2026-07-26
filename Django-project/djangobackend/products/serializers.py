from rest_framework import serializers
from .models import Product, Bid

class BidSerializer(serializers.ModelSerializer):
    bidder_username = serializers.ReadOnlyField(source='bidder.username')

    class Meta:
        model = Bid
        fields = ['id', 'product', 'bidder', 'bidder_username', 'amount', 'created_at']
        read_only_fields = ['bidder']

    def validate(self, attrs):
        product = attrs['product']
        amount = attrs['amount']
        request = self.context.get('request')

        if request and request.user == product.seller:
            raise serializers.ValidationError("Bidding oun your own product aint allowed")

        if not product.is_active:
            raise serializers.ValidationError("This auction has ended.")

        if amount <= product.current_price:
            raise serializers.ValidationError(
                f"Bid must be greater than current price of {product.current_price}."
            )


        return attrs


class ProductSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'starting_bid', 
            'current_price', 'seller', 'seller_username', 
            'winner', 'start_time', 'end_time', 'is_active', 'bids'
        ]
        read_only_fields = ['seller', 'current_price', 'winner']