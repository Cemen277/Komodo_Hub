from django.urls import path
from .views import RegisterUserView, LoginUserView, CreatePostView, ResetPasswordView, NewPasswordView, OrganisationNameView, PostUserView, OrganisationActivityView, ActivityContentView, ActiveTaskView, ActiveTaskContentView, CompletedTaskView, CompletedTaskContentView, ListUsersView, AddConversationView, ConversationDataView, AddLibraryView, LibraryContentView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name = 'login'),
    path('post/', CreatePostView.as_view(), name = 'create post'),
    path('reset_password/', ResetPasswordView.as_view(), name = 'reset password'),
    path('new_password/', NewPasswordView.as_view(), name = 'new password'),
    path('posts_feed/', PostUserView.as_view(), name = 'posts feed'),
    path('organisation_name/', OrganisationNameView.as_view(), name = 'organisation name'),
    path('organisation_activity/', OrganisationActivityView.as_view(), name = 'organisation activity'),
    path('activity_content/', ActivityContentView.as_view(), name = 'activity content'),
    path('active_tasks/', ActiveTaskView.as_view(), name = 'active tasks'),
    path('active_task_content/', ActiveTaskContentView.as_view(), name = 'active task content'),
    path('completed_tasks/', CompletedTaskView.as_view(), name = 'completed tasks'),
    path('completed_task_content/', CompletedTaskContentView.as_view(), name = 'completed task content'),
    path('list_users/', ListUsersView.as_view(), name = 'list users'),
    path('add_conversation/', AddConversationView.as_view(), name = 'add conversation'),
    path('conversation_data/', ConversationDataView.as_view(), name = 'conversation data'),
    path('add_library/', AddLibraryView.as_view(), name = 'add library'),
    path('library_content/', LibraryContentView.as_view(), name = 'library content'),
]