from django.urls import path
from users.views import RegisterView
from products.views import ProductListCreateView, PlaceBidView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # auth routes
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # product/bid routes
    path('products/', ProductListCreateView.as_view(), name='product-list'),
    path('bids/', PlaceBidView.as_view(), name='place-bid'),
]