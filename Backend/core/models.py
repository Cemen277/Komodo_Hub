from django.db import models

class UserInfo(models.Model):
    user_id = models.AutoField(primary_key=True)  # Supabase primary key
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255)
    password = models.TextField()
    image = models.TextField(null=True, blank=True)
    organisation_id = models.IntegerField(null=True, blank=True)
    programme_id = models.IntegerField(null=True, blank=True)
    user_type = models.CharField(max_length=100)
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'user_info'
        managed = False  # Important: Don't let Django try to manage this table

class PostInfo(models.Model):
    post_id = models.AutoField(primary_key = True)
    user_id = models.IntegerField()
    media_url = models.TextField()
    post_text = models.CharField(max_length = 500, null = True,  blank = True)
    created_timestamp = models.DateTimeField(auto_now_add = True)

    class Meta:
        db_table = 'post'
        managed = False

class ResetPassword(models.Model):
    reset_id = models.AutoField(primary_key = True)
    user_id = models.IntegerField()
    reset_token = models.TextField()
    created_timestamp = models.DateTimeField(auto_now_add = True)
    expires_timestamp = models.DateTimeField()

    class Meta:
        db_table = 'password_reset'
        managed = True
