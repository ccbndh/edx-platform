"""
Admin site bindings for contentstore
"""

from django.contrib import admin

from config_models.admin import ConfigurationModelAdmin
from contentstore.models import VideoUploadConfig, MobileNotificationsConfig

admin.site.register(VideoUploadConfig, ConfigurationModelAdmin)
admin.site.register(MobileNotificationsConfig, ConfigurationModelAdmin)
