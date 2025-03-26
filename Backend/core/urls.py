from django.urls import path
from .views import RegisterUserView, LoginUserView, CreatePostView, ResetPasswordView, NewPasswordView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name = 'login'),
    path('post/', CreatePostView.as_view(), name = 'create post'),
    path('reset_password/', ResetPasswordView.as_view(), name = 'reset password'),
    path('new_password/', NewPasswordView.as_view(), name = 'new password'),
]