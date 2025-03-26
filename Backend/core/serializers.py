from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserInfo, PostInfo, ResetPassword

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['email', 'full_name', 'username', 'password', 'user_type']

class PostInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostInfo
        fields =['user_id','media_url', 'post_text']

class ResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetPassword
        fields = ['user_id', 'reset_token', 'created_timestamp', 'expires_timestamp']

class NewPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetPassword
        fields = ['user_id', 'new_password','token']