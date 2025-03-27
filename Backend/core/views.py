from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from .models import UserInfo, PostInfo, ResetPassword, Organisation, Programme, OrganisationActivity, Task, CompletedTask, Conversation, ConversationMessage
from .serializers import UserInfoSerializer, PostInfoSerializer, ResetPasswordSerializer, NewPasswordSerializer, PostUserSerializer, OrganisationActivitySerializer, ActiveTaskSerializer, CompletedTaskSerializer, ConversationSerializer, ConversationMessageSerializer
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
            return Response({"message": "Login successful", "user_id": user.user_id},  status=status.HTTP_200_OK)

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
    def post(self, request):
        posts = PostInfo.objects.all().order_by('-created_timestamp')
        serializer = PostUserSerializer(posts, many=True)
        return Response(serializer.data)


class OrganisationNameView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)

        user = UserInfo.objects.filter(user_id = user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        organisation = None
        programme = None

        if user.organisation_id:
            organisation = Organisation.objects.filter(organisation_id=user.organisation_id).first()

        
        if user.programme_id:
            programme = Programme.objects.filter(programme_id=user.programme_id).first()

        if organisation:
            organisation_name = organisation.organisation_name
        else: 
            organisation_name = "No organisation yet"

        if programme:
            programme_name = programme.programme_name
        else: 
            programme_name = "No programme yet"
        

        return Response({
            "organisation_name": organisation_name, 
            "programme_name": programme_name
        }, status=status.HTTP_200_OK)


class OrganisationActivityView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)

        user = UserInfo.objects.filter(user_id = user_id).first()
        if not user or not user.programme_id:
            return Response({"error": "User or programme not found"}, status=404)

        activities = OrganisationActivity.objects.filter(programme_id = user.programme_id)
        
        serializer = OrganisationActivitySerializer(activities, many = True)
        return Response(serializer.data)

class ActivityContentView(APIView):
    def post(self, request):
        activity_id = request.data.get('activity_id')

        if not activity_id:
            return Response({"error": "Missing activity_id"}, status=400)

        activity = OrganisationActivity.objects.filter(activity_id=activity_id).first()

        if not activity:
            return Response({"error": "Activity not found"}, status=404)

        data = {
            "activity_header": activity.activity_header,
            "activity_text": activity.activity_text,
        }

        return Response(data, status=200)

# "media_url": activity.media_url,
# "creator": activity.creator,
# "created_timestamp": activity.created_timestamp

class ActiveTaskView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)

        user = UserInfo.objects.filter(user_id = user_id).first()
        if not user:
            return Response({"error": "User or programme not found"}, status=404)

        active_tasks = Task.objects.filter(programme_id = user.programme_id)
        
        serializer = ActiveTaskSerializer(active_tasks, many = True)
        return Response(serializer.data)

class ActiveTaskContentView(APIView):
    def post(self, request):
        task_id = request.data.get('task_id')

        if not task_id:
            return Response({"error": "Missing task_id"}, status=400)

        task = Task.objects.filter(task_id=task_id).first()

        if not task:
            return Response({"error": "Task not found"}, status=404)

        data = {
            "task_name": task.task_name,
            "task_description": task.task_description,
            "created_timestamp": task.created_timestamp
        }

        return Response(data, status=200)


class CompletedTaskView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)

        user = UserInfo.objects.filter(user_id = user_id).first()
        if not user:
            return Response({"error": "User or programme not found"}, status=404)

        completed_tasks = CompletedTask.objects.filter(user_id = user.user_id)

        data = []

        for task in completed_tasks:
            task_info = Task.objects.filter(task_id=task.task_id).first()
            task_name = task_info.task_name

            data.append({
                "task_name": task_name,
                "task_id": task.task_id,
                "created_timestamp": task.created_timestamp
            })
        
        return Response(data, status=200)

class CompletedTaskContentView(APIView):
    def post(self, request):
        task_id = request.data.get('task_id')

        if not task_id:
            return Response({"error": "Missing task_id"}, status=400)

        task = CompletedTask.objects.filter(task_id=task_id).first()

        if not task:
            return Response({"error": "Task not found"}, status=404)

        task_info = Task.objects.filter(task_id = task.task_id).first()
        if not task_info:
            return Response({"error": "Original task info not found"}, status=404)
        task_name = task_info.task_name
        task_description = task_info.task_description

        data = {
            "task_name": task_name,
            "task_description": task_description,
            "created_timestamp": task.created_timestamp
        }

        return Response(data, status=200)

class ListUsersView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)

        user = UserInfo.objects.filter(user_id = user_id).first()
        if not user:
            return Response({"error": "User or programme not found"}, status=404)

        users = UserInfo.objects.filter(organisation_id = user.organisation_id).exclude(user_id=user.user_id)
        
        serializer = UserInfoSerializer(users, many = True)
        return Response(serializer.data)

class AddConversationView(APIView):
    def post(self, request):
        sender_id = request.data.get('sender_id')
        receiver_id = request.data.get('receiver_id')
        
        if not sender_id or not receiver_id:
            return Response({"error": "Missing sender_id or receiver_id"}, status=400)

        existing = Conversation.objects.filter(sender_id = sender_id, receiver_id = receiver_id).first()
        if existing:
            return Response({"message": "Conversation already exists", "conversation_id": existing.conversation_id}, status=200)

        conversation = Conversation.objects.create(
            sender_id = sender_id,
            receiver_id = receiver_id
        )

        return Response({
            "conversation_id": conversation.conversation_id
        }, status = 201)


class ConversationDataView(APIView):
    def post(self, request):
        conversation_id = request.data.get('conversation_id')
        user_id = request.data.get('user_id')

        if not conversation_id or not user_id:
            return Response({"error": "Missing conversation_id or user_id"}, status=400)

        conversation = Conversation.objects.filter(conversation_id=conversation_id).first()
        if not conversation:
            return Response({"error": "Conversation not found"}, status=404)

        if conversation.sender_id == int(user_id):
            other_user_id = conversation.receiver_id
        else:
            other_user_id = conversation.sender_id

        other_user = UserInfo.objects.filter(user_id=other_user_id).first()
        if not other_user:
            return Response({"error": "User not found"}, status=404)

        return Response({
            "username": other_user.username,
            "profile_image": other_user.profile_image
        }, status=200)



        

