from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from .models import UserInfo, PostInfo, ResetPassword
from .serializers import UserInfoSerializer, PostInfoSerializer, ResetPasswordSerializer, NewPasswordSerializer
from django.utils import timezone
import secrets 
from datetime import timedelta
from django.core.mail import send_mail
from django.utils.timezone import make_aware



class RegisterUserView(generics.CreateAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer


class LoginUserView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')
        password = request.data.get('password')

    
        user = UserInfo.objects.filter(email=identifier).first() or \
                UserInfo.objects.filter(username=identifier).first()
    
        if not user:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.password == password:
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)

        else:
            return Response({"message": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)

class CreatePostView(generics.CreateAPIView):
    queryset = PostInfo.objects.all()
    serializer_class = PostInfoSerializer

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = UserInfo.objects.filter(email = email).first()

        token = secrets.token_urlsafe(32)

        now = timezone.now()
        expires = now + timedelta(minutes = 30)

        reset_save = ResetPassword.objects.create(
            user_id = user.user_id,
            reset_token = token,
            created_timestamp = now,
            expires_timestamp = expires
        )

        reset_link = f"http://127.0.0.1:5500/Reset%20Password%20Page%20-%20front/reset_password.html?token={token}"

        send_mail(
            subject = 'Reset your Komodo Hub password',
            message = f'Please click the link to reset your password: {reset_link}',
            from_email = 'support@komodohub.org',
            recipient_list = [email],
            fail_silently = False,
        )
        return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
            
class NewPasswordView(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not token or not new_password:
            return Response({"error": "Token and new password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        reset_entry = ResetPassword.objects.filter(reset_token = token).first()

        if not reset_entry:
            return Response({"error": "Invalid token."}, status=status.HTTP_404_NOT_FOUND)

        if make_aware(reset_entry.expires_timestamp) < timezone.now():
            return Response({"error": "Token expired."}, status=status.HTTP_410_GONE)

        user = UserInfo.objects.filter(user_id = reset_entry.user_id).first()

        user.password = new_password 
        user.save()

        reset_entry.delete()

        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

class PostUserView(APIView):
    def(self, request):
        posts = PostInfo.objects.all().order_by('-created_timestamp')
        serializer = PostUserSerializer(posts, many=True)
        return Response(serializer.data)

        