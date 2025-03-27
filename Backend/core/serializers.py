from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserInfo, PostInfo, ResetPassword, Organisation, OrganisationActivity, Task, CompletedTask, Conversation, ConversationMessage

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['user_id','email', 'full_name', 'username', 'password', 'user_type', 'profile_image']

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
    organisation_name = serializers.SerializerMethodField()

    class Meta:
        model = PostInfo
        fields = ['post_id', 'user_id', 'post_text', 'media_url', 'created_timestamp',
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

class OrganisationActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganisationActivity
        fields = [
            'activity_id',
            'organisation_id',
            'programme_id',
            'activity_header',
            'cover_image',
            'media_url',
            'activity_text',
            'creator',
            'created_timestamp'
        ]

class ActiveTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'task_id',
            'organisation_id',
            'programme_id',
            'task_name',
            'task_description',
            'creator',
            'created_timestamp'
        ]

class CompletedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedTask
        fields = [
            'task_id',
            'user_id',
            'grade',
            'feedback',
            'created_timestamp'
        ]

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            'conversation_id',
            'sender_id',
            'receiver_id',
            'created_timestamp'
        ]

class ConversationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationMessage
        fields = [
            'message_id',
            'conversation_id',
            'sender_id',
            'receiver_id',
            'message_content',
            'message_type',
            'created_timestamp'
        ]


