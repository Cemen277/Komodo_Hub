from django.db import models

class UserInfo(models.Model):
    user_id = models.AutoField(primary_key=True)  # Supabase primary key
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255)
    password = models.TextField()
    organisation_id = models.IntegerField(null=True, blank=True)
    programme_id = models.IntegerField(null=True, blank=True)
    user_type = models.CharField(max_length=100)
    media = models.URLField(null=True, blank=True)
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'user_info'
        managed = False  # Important: Don't let Django try to manage this table

class ResetPassword(models.Model):
    reset_id = models.AutoField(primary_key = True)
    user_id = models.IntegerField()
    reset_token = models.CharField()
    created_timestamp = models.DateTimeField()
    expires_timestamp = models.DateTimeField()

    class Meta:
        db_table = 'password_reset'
        managed = True

class Organisation(models.Model):
    organisation_id = models.AutoField(primary_key = True)
    organisation_name = models.CharField(max_length = 255, unique = True)
    description = models.TextField()
    media = models.URLField(null=True, blank=True)
    organisation_type = models.CharField(max_length = 100)
    members_num = models.IntegerField(null = True)

    class Meta:
        db_table = 'organisation'
        managed = False

class Programme(models.Model):
    programme_id = models.AutoField(primary_key = True)
    organisation_id = models.IntegerField()
    programme_name = models.CharField(max_length = 100, unique = True)

    class Meta:
        db_table = 'programme'
        managed = False

class OrganisationActivity(models.Model):
    activity_id = models.AutoField(primary_key = True)
    organisation_id = models.IntegerField()
    programme_id = models.IntegerField()
    activity_header = models.CharField(max_length = 100, unique = True)
    cover_image = models.URLField(null=True, blank=True)
    media_url = models.URLField(null=True, blank=True)
    activity_text = models.TextField()
    creator = models.IntegerField()
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'organisation_activity'
        managed = False

class Task(models.Model):
    task_id = models.AutoField(primary_key = True)
    programme_id = models.IntegerField()
    organisation_id = models.IntegerField()
    task_name = models.CharField(max_length = 100, unique = True)
    task_description = models.TextField()
    creator = models.IntegerField()
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'task'
        managed = False

class CompletedTask(models.Model):
    completed_task_id = models.AutoField(primary_key=True)
    task_id = models.IntegerField()
    user_id = models.IntegerField()
    grade = models.IntegerField(null = True)
    feedback = models.CharField(max_length = 500)
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'completed_task'
        managed = False

class Conversation(models.Model):
    conversation_id = models.AutoField(primary_key = True)
    sender_id = models.IntegerField()
    receiver_id = models.IntegerField()
    created_timestamp = models.DateTimeField(auto_now_add = True)
    
    class Meta:
        db_table = 'conversation'
        managed = True

class ConversationMessage(models.Model):
    message_id = models.AutoField(primary_key = True)
    conversation_id = models.IntegerField()
    sender_id = models.IntegerField()
    receiver_id = models.IntegerField()
    message_content = models.TextField()
    message_type = models.CharField(max_length = 100)
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'conversation_message'
        managed = True

class DigitalLibrary(models.Model):
    library_id = models.AutoField(primary_key = True)
    organisation_id = models.IntegerField()
    library_visibility = models.CharField(max_length = 100)

    class Meta:
        db_table = 'digital_library'
        managed = False

class LibraryArticle(models.Model):
    article_id = models.AutoField(primary_key = True)
    library_id = models.IntegerField()
    article_header = models.CharField(max_length = 100)
    cover_image = models.URLField(null=True, blank=True)
    media = models.URLField(null=True, blank=True)
    article_text = models.TextField()
    creator = models.IntegerField()
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'library_article'
        managed = False

class Post(models.Model):
    post_id = models.AutoField(primary_key = True)
    user_id = models.IntegerField()
    media = models.URLField(null=True, blank=True)
    post_text = models.TextField()
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'post'
        managed = False

class PostLike(models.Model):
    like_id = models.AutoField(primary_key = True)
    post_id = models.IntegerField()
    user_id = models.IntegerField()
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'post_like'
        managed = False

class PostComment(models.Model):
    comment_id = models.AutoField(primary_key = True)
    post_id = models.IntegerField()
    user_id = models.IntegerField()
    comment_text = models.TextField()
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'post_comment'
        managed = False
        
