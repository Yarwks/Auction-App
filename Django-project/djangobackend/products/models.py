from django.db import models
from django.conf import settings
from django.utils import timezone


def default_end_time():
    return timezone.now() + timezone.timedelta(days=7)


# Create your models here.
class Product(models.Model):
    title = models.CharField(max_length=255, default=None, null=True, blank=True)
    description = models.TextField(default=None, null=True, blank=True)
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=None)
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='listed_products',
        default=None,
    )
    winner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='won_auctions'
    )
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(default=default_end_time)
    is_active = models.BooleanField(default=True)

    def check_and_close_auction(self):
        if self.is_active and timezone.now() >= self.end_time:
            self.is_active = False
            highest_bid = self.bids.order_by('-amount').first()
            if highest_bid:
                self.winner = highest_bid.bidder
            self.save()

    def save(self, *args, **kwargs):
        if not self.current_price:
            self.current_price = self.starting_bid
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Bid(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-amount']  

    def __str__(self):
        return f"{self.bidder} - ${self.amount} on {self.product.title}"