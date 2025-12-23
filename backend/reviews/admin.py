from django.contrib import admin
from .models import Department, Course, Professor, Review


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name']
    search_fields = ['code', 'name']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'department', 'created_at']
    search_fields = ['code', 'title']
    list_filter = ['department', 'created_at']


@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'created_at']
    search_fields = ['name']
    list_filter = ['department', 'created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['course', 'professor', 'rating', 'workload', 'difficulty', 'created_at']
    list_filter = ['rating', 'workload', 'difficulty', 'created_at']
    search_fields = ['course__code', 'course__title', 'professor__name', 'comment']
    readonly_fields = ['created_at', 'updated_at']
