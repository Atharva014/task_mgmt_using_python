from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, 
    UserListView, 
    current_user, 
    update_profile, 
    change_password, 
    delete_account
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', current_user, name='current-user'),
    path('<int:pk>/update/', update_profile, name='update-profile'),
    path('change-password/', change_password, name='change-password'),
    path('<int:pk>/delete/', delete_account, name='delete-account'),
    path('', UserListView.as_view(), name='user-list'),
]