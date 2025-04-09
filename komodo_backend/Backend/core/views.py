from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from .models import Post, PostLike, PostComment, UserInfo, ResetPassword, Organisation, Programme, OrganisationActivity, Task, CompletedTask, Conversation, ConversationMessage, DigitalLibrary, LibraryArticle
from .serializers import PostSerializer, PostLikeSerializer, PostCommentSerializer, UserInfoSerializer,  ResetPasswordSerializer, NewPasswordSerializer, OrganisationActivitySerializer, ActiveTaskSerializer, CompletedTaskSerializer, ConversationSerializer, ConversationMessageSerializer, DigitalLibrarySerializer, LibraryArticleSerializer
from django.utils import timezone
import secrets 
from datetime import timedelta
from django.core.mail import send_mail
from django.utils.timezone import make_aware
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from core.utils.supabase_upload import upload_to_supabase
from django.utils.timezone import now
from django.db.models import Q
import traceback

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

        if check_password(password, user.password):
            return Response({"message": "Login successful", "user_id": user.user_id},  status=status.HTTP_200_OK)

        else:
            return Response({"message": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)


class ResetPasswordView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')

            if not email:
                return Response({'error': 'Email is required.'}, status=400)

            user = UserInfo.objects.filter(email=email).first()

            if not user:
                return Response({'error': 'User not found.'}, status=404)

            token = secrets.token_urlsafe(32)
            now = timezone.now()
            expires = now + timedelta(minutes=30)

            ResetPassword.objects.create(
                user_id=user.user_id,
                reset_token=token,
                created_timestamp=now,
                expires_timestamp=expires
            )

            reset_link = f"https://komodohub.org/reset_password/reset_password.html?token={token}"

            try:
                send_mail(
                    subject='Reset Your Komodo Hub Password',
                    message=f'''
Hi there,

We received a request to reset your password for your Komodo Hub account.

To set a new password, please click the link below:
{reset_link}

This link will expire in 30 minutes.

If you didn’t request a password reset, feel free to ignore this email.

— Komodo Hub Team
                    ''',
                    from_email='support@komodohub.org',
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception:
                return Response({'error': 'Failed to send email.'}, status=500)

            return Response({'message': 'Password reset email sent.'}, status=200)

        except Exception as e:
            return Response({'error': f'Server error: {str(e)}'}, status=500)

            
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

        user.password = make_password(new_password) 
        user.save()

        reset_entry.delete()

        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)




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

        activities = OrganisationActivity.objects.filter(programme_id = user.programme_id).order_by('-created_timestamp')
        
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

        active_tasks = Task.objects.filter(programme_id = user.programme_id).order_by('-created_timestamp')
        
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

        completed_tasks = CompletedTask.objects.filter(user_id = user.user_id).order_by('-created_timestamp')

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
        
        user_data = []
        for user in users:
            username = user.username
            image = user.media
            user_id = user.user_id
            user_data.append({
                "image" : image,
                "username" : username,
                "user_id" : user_id
            })
        
        return Response(user_data)

class AddConversationView(APIView):
    def post(self, request):
        sender_id = request.data.get('sender_id')
        receiver_id = request.data.get('receiver_id')
        
        if not sender_id or not receiver_id:
            return Response({"error": "Missing sender_id or receiver_id"}, status=400)

        existing = Conversation.objects.filter(
            Q(sender_id=sender_id, receiver_id=receiver_id) |
            Q(sender_id=receiver_id, receiver_id=sender_id)
        ).first()
        if existing:
            return Response({"message": "Conversation already exists", "conversation_id": existing.conversation_id}, status=200)

        conversation = Conversation.objects.create(
            sender_id = sender_id,
            receiver_id = receiver_id
        )
        return Response({"conversation_id": conversation.conversation_id}, status = 201)


class ConversationDataView(APIView):
    def post(self, request):
        conversation_id = request.data.get('conversation_id')
        user_id = int(request.data.get('user_id'))

        if not conversation_id or not user_id:
            return Response({"error": "Missing conversation_id or user_id"}, status=400)

        conversation = Conversation.objects.filter(conversation_id=conversation_id).first()
        if not conversation:
            return Response({"error": "Conversation not found"}, status=404)

        if conversation.sender_id == user_id:
            other_user_id = conversation.receiver_id
        else:
            other_user_id = conversation.sender_id

        other_user = UserInfo.objects.filter(user_id=other_user_id).first()
        if not other_user:
            return Response({"error": "User not found"}, status=404)

        return Response({
            "username": other_user.username,
            "profile_image": other_user.media,
            "user_id": other_user.user_id,
            "conversation_id" : conversation_id
        }, status=200)

class SendMessageView(APIView):
    def post(self, request):
        try:
            print("✅ Raw incoming data:", request.data)

            conversation_id = int(request.data.get("conversation_id"))
            sender_id = int(request.data.get("sender_id"))
            receiver_id = int(request.data.get("receiver_id"))

            message_content = request.data.get("message_content", "").strip()
            message_type = request.data.get("message_type")

            if not message_content:
                return Response({"error": "Empty message"}, status=400)

            conversation = Conversation.objects.filter(conversation_id=conversation_id).first()
            if not conversation:
                return Response({"error": "Conversation not found"}, status=404)

            sender = UserInfo.objects.filter(user_id=sender_id).first()
            receiver = UserInfo.objects.filter(user_id=receiver_id).first()

            print("🧍 Sender:", sender)
            print("🧍 Receiver:", receiver)

            if not sender or not receiver:
                return Response({"error": "Invalid sender or receiver"}, status=400)

            message = ConversationMessage.objects.create(
                conversation_id=conversation.conversation_id, 
                sender_id=sender,
                receiver_id=receiver,
                message_content=message_content,
                message_type=message_type
            )

            print("✅ Message created:", message.id)
            return Response({"message": "Message sent"}, status=201)

        except Exception as e:
            import traceback
            traceback.print_exc()
            print("❌ Uncaught Exception:", str(e))
            return Response({"error": "Internal server error", "details": str(e)}, status=500)


class ConversationContentView(APIView):
    def post(self, request):
        conversation_id = request.data.get("conversation_id")
        user_id = request.data.get("user_id")

        user = UserInfo.objects.filter(user_id = user_id).first()
        conversation = Conversation.objects.filter(conversation_id = conversation_id).first()

        messages = ConversationMessage.objects.filter(conversation_id = conversation.conversation_id).order_by("created_timestamp")

        message_data = []
        for message in messages:
            direction = "out" if message.sender_id == user_id else "in"
            message_data.append({
                "content": message.message_content,
                "direction": direction,
                "timestamp": message.timestamp.isoformat()
            })
            
        return Response({"messages": message_data}, status = 200)

class ListChatsView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)

        user = UserInfo.objects.filter(user_id = user_id).first()
        if not user:
            return Response({"error": "User or programme not found"}, status=404)

        chats = Conversation.objects.filter(
            Q(sender_id=user.user_id) | Q(receiver_id=user.user_id)
        )

        chat_data = []
        for chat in chats:
            if chat.sender_id == user.user_id:
                other_user_id = chat.receiver_id
            else:
                other_user_id = chat.sender_id
            chat_user = UserInfo.objects.filter(user_id=other_user_id).first()
            username = chat_user.username
            user_image = chat_user.media
            
            chat_data.append({
                "name" : username,
                "image" : user_image,
                "conversation_id" : chat.conversation_id
            })
        return Response(chat_data, status = 200)


    
class AddLibraryView(APIView):
    def get(self, request):
        libraries = DigitalLibrary.objects.all()
        data = []

        for library in libraries:
            organisation = Organisation.objects.filter(organisation_id=library.organisation_id).first()
            if organisation:
                data.append({
                    "library_id": library.library_id,
                    "organisation_name": organisation.organisation_name,
                    "image": organisation.media,
                    
                })
        
        return Response(data, status = 200)

class LibraryContentView(APIView):
    def post(self, request):
        library_id = request.data.get('library_id')

        if not library_id:
            return Response({"error": "Missing library_id"}, status=400)

        library = DigitalLibrary.objects.filter(library_id=library_id).first()
        if not library:
            return Response({"error": "Missing library"}, status=400)

        organisation = Organisation.objects.filter(organisation_id = library.organisation_id).first()
        if not organisation:
            return Response({"error": "Missing organisation"}, status=400)

        org_data = []
        org_data = {
            "organisation_name" : organisation.organisation_name,
            "organisation_description" : organisation.description,
            "members_num" : organisation.members_num
        }
        
        library_articles = LibraryArticle.objects.filter(library_id = library.library_id).order_by('-created_timestamp')

        article_data = []
        for article in library_articles:
            article_data.append({
                "article_id" : article.article_id,
                "article_header": article.article_header,
                "cover_image": article.cover_image,
                "media": article.media,
            })


        return Response({
            "organisation": org_data,
            "articles": article_data
        }, status=200)


class ArticleContentView(APIView):
    def post(self, request):
        article_id = request.data.get('article_id')
        if not article_id:
            return Response({"error": "Missing article_id"}, status=400)

        article = LibraryArticle.objects.filter(article_id=article_id).first()
        if not article:
            return Response({"error": "Missing article"}, status=400)

        data = []

        data = {
            "article_header" : article.article_header,
            "article_text" : article.article_text,
            "media": article.media,
            "created_timestamp" : article.created_timestamp
        }

        return Response(data, status=200)


class PullPostsView(APIView):
    def get(self, request):
        posts = Post.objects.all().order_by('-created_timestamp')
        post_data = []
        for post in posts:
            user =  UserInfo.objects.filter(user_id = post.user_id).first()
            if not user:
                continue

            organisation = None
            if user.organisation_id:
                organisation = Organisation.objects.filter(organisation_id=user.organisation_id).first()
           
            likes_count = PostLike.objects.filter(post_id=post.post_id).count()
            comments_count = PostComment.objects.filter(post_id=post.post_id).count()

            post_data.append({
                "post_id" : post.post_id,
                "post_text" : post.post_text,
                "media" : post.media,
                "username" : user.username,
                "organisation_name" : organisation.organisation_name if organisation else "No organisation",
                "created_timestamp" : post.created_timestamp,
                "likes_count" : likes_count,
                "comments_count" : comments_count,
                "profile_image" : user.media,

            })
        
        return Response(post_data, status = 200)


class AddLikeView(generics.CreateAPIView):
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer

class CreatePostView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user_id = request.data.get("user_id")
        post_text = request.data.get("post_text")
        media = request.FILES.get("media")

        media_url = None
        if media:
            timestamp = int(now().timestamp())
            file_path = f"posts/{user_id}_{timestamp}_{media.name}"
            media_url = upload_to_supabase(media, file_path)

        post = Post.objects.create(
            user_id=user_id,
            post_text=post_text,
            media=media_url,
        )

        return Response({"message": "Post created", "media_url": media_url}, status=201)

class UpdateNameView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        new_full_name = request.data.get("new_full_name")

        user = UserInfo.objects.filter(user_id = user_id).first()

        user.full_name = new_full_name
        
        user.save()

        return Response({"message" : "Name updated!"}, status=200)

class UpdateUsernameView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        new_username = request.data.get("new_username")

        user = UserInfo.objects.filter(user_id = user_id).first()

        user.username = new_username
        
        user.save()

        return Response({"message" : "Username updated!"}, status=200)

class UpdateEmailView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        new_email = request.data.get("new_email")

        user = UserInfo.objects.filter(user_id = user_id).first()

        user.email = new_email
        
        user.save()

        return Response({"message" : "Email updated!"}, status=200)

class GetUserInfoView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        user = UserInfo.objects.filter(user_id = user_id).first()
        
        organisation = Organisation.objects.filter(organisation_id = user.organisation_id).first()

            

        data = []
        data = {
            "profile_image": user.media,
            "full_name" : user.full_name,
            "email" : user.email,
            "username" : user.username,
            "organisation_name" : organisation.organisation_name if organisation else "No organisation yet"
            
        }

        return Response(data, status = 200)

class ListOrganisationsView(APIView):
    def get(self, request):
        organisations = Organisation.objects.all()
        organisation_data = []
        for list_organisation in organisations:
            organisation_data.append({
                "organisation_id" : list_organisation.organisation_id,
                "organisation_name" : list_organisation.organisation_name
            })
        return Response(organisation_data, status = 200)

class JoinOrganisationView(APIView):
    def post(self, request):
        organisation_id = request.data.get("organisation_id")
        user_id = request.data.get("user_id")

        user = UserInfo.objects.filter(user_id = user_id).first()
        organisation = Organisation.objects.filter(organisation_id = organisation_id).first()

        if (user.organisation_id == organisation.organisation_id):
            button_text = "Leave"
        else:
            button_text = "Join"


        data = []

        data = {
            "organisation_name" : organisation.organisation_name,
            "description" : organisation.description,
            "button_text" : button_text,
            "members_num" : organisation.members_num
        }

        return Response(data, status = 200)

class UpdateOrganisationView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        organisation_id = request.data.get("organisation_id")

        user = UserInfo.objects.filter(user_id = user_id).first()

        if user.organisation_id:
            prev_org = Organisation.objects.filter(organisation_id=user.organisation_id).first()
            if prev_org:
                prev_org.members_num = max(prev_org.members_num - 1, 0)
                prev_org.save()

        user.organisation_id = organisation_id

        user.save()

        organisation = Organisation.objects.filter(organisation_id = organisation_id).first()

        organisation.members_num += 1
        organisation.save()

        return Response({"message" : "Organisation updated!"}, status=200) 

class LeaveOrganisationView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        user = UserInfo.objects.filter(user_id = user_id).first()

        organisation = Organisation.objects.filter(organisation_id=user.organisation_id).first()

        if organisation:
            organisation.members_num = max(organisation.members_num - 1, 0)
            organisation.save()

        user.organisation_id = None
        
        user.save()

        return Response({"message" : "Organisation removed!"}, status=200) 

class ListProgramsView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        user = UserInfo.objects.filter(user_id = user_id).first()

        organisation = Organisation.objects.filter(organisation_id = user.organisation_id).first()
        if not organisation:
            return Response({"error": "Missing organisation"}, status=400)
        
        programs = Programme.objects.filter(organisation_id = organisation.organisation_id)

        programs_data = []
        for programme in programs:
            if (user.programme_id == programme.programme_id):
                button_text = "Leave"
            else:
                button_text = "Join"
            programs_data.append({
                "programme_name" : programme.programme_name,
                "button_text" : button_text,
                "programme_id" : programme.programme_id
            })
        return Response(programs_data, status = 200)

class UpdateProgrammeView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        programme_id = request.data.get("programme_id")

        user = UserInfo.objects.filter(user_id = user_id).first()

        user.programme_id = programme_id
        
        user.save()

        return Response({"message" : "Programme updated!"}, status=200) 

class LeaveProgrammeView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        user = UserInfo.objects.filter(user_id = user_id).first()

        user.programme_id = None
        
        user.save()

        return Response({"message" : "Programme removed!"}, status=200) 


class UpdateProfileImageView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user_id = request.data.get("user_id")
        user = UserInfo.objects.filter(user_id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        file = request.FILES.get("media")
        if not file:
            return Response({"error": "No media uploaded"}, status=400)


        timestamp = int(now().timestamp())
        file_path = f"users/{user_id}_{timestamp}_{file.name}"
        media_url = upload_to_supabase(file, file_path)

        user.media = media_url
        user.save()

        return Response({"message": "Profile image updated", "media_url": media_url}, status=200)

class ChangePasswordView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        password  = request.data.get("password")
        new_password = request.data.get("new_password")
        user = UserInfo.objects.filter(user_id = user_id).first()

        if check_password(password, user.password):
            user.password = make_password(new_password)
            user.save()
        else:
            return Response({"error" : "Current password doesn't match!"}, status =400)

        return Response({"message": "Password updated!"}, status=200)


