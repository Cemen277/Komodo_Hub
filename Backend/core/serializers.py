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

class PostUserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    organisation_name = serializers.SerializerMethodFeild()

    class Meta:
        model = PostInfo
        feilds = ['post_id', 'user_id', 'post_text', 'media_url', 'created_timestamp',
            'full_name', 'user_image', 'organisation_name']

        def get_username(self, obj):
            user = UserInfo.objects.filter(user_id = obj.user_id).first()
            return user.username if user else None

        def get_user_image(self, obj):
            user = UserInfo.objects.filter(user_id = obj.user_id).first()
            return user.image if user else None

        def get_user_organisation(self, obj):
            user = UserInfo.objects.filter(user_id = obj.user_id).first()
            organisation = Organisation.objects.filter(organisation_id = user.organisation_id).first()
            return organisation.organisation_name if organisation else None