from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, PostLike, PostComment, UserInfo,  ResetPassword, Organisation, OrganisationActivity, Task, CompletedTask, Conversation, ConversationMessage, DigitalLibrary, LibraryArticle

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['user_id','email', 'full_name', 'username', 'password', 'user_type', 'profile_image']


class ResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetPassword
        fields = ['user_id', 'reset_token', 'created_timestamp', 'expires_timestamp']


class NewPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetPassword
        fields = ['user_id', 'new_password','token']


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

class DigitalLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DigitalLibrary
        fields = [
            'library_id',
            'organisation_id',
            'library_visibility'
        ]

class LibraryArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryArticle
        fields = [
            'article_id',
            'library_id',
            'article_header',
            'cover_image',
            'media_url',
            'article_text',
            'creator',
            'created_timestamp'
        ]

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'user_id',
            'media_url',
            'post_text',
            'created_timestamp'
        ]

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = [
            'post_id',
            'user_id'
            
        ]


class PostCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'post_id',
            'user_id',
            'coment_text',
            'created_timestamp'
            
        ]