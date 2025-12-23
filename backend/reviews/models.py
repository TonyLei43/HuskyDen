from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class Department(models.Model):
    """Represents a department at UW"""
    code = models.CharField(max_length=10, unique=True, help_text="Department code (e.g., CSE, MATH)")
    name = models.CharField(max_length=200, help_text="Full department name")
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    class Meta:
        ordering = ['code']


class Course(models.Model):
    """Represents a course at UW"""
    code = models.CharField(max_length=20, unique=True, help_text="Course code (e.g., CSE142)")
    title = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.code}: {self.title}"
    
    @property
    def avg_rating(self):
        """Calculate average rating from reviews"""
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return None
    
    @property
    def avg_workload(self):
        """Calculate average workload from reviews"""
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(r.workload for r in reviews) / reviews.count(), 1)
        return None
    
    @property
    def avg_difficulty(self):
        """Calculate average difficulty from reviews"""
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(r.difficulty for r in reviews) / reviews.count(), 1)
        return None
    
    class Meta:
        ordering = ['code']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['department']),
        ]


class Professor(models.Model):
    """Represents a professor at UW"""
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True, help_text="URL-friendly version of name")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='professors')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Professor.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    @property
    def avg_rating(self):
        """Calculate average rating from reviews"""
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return None
    
    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['slug']),
        ]


class Review(models.Model):
    """Represents a review for a course and/or professor"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    professor = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Overall rating (1-5)"
    )
    workload = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Workload rating (1-5, 5 being heaviest)"
    )
    difficulty = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Difficulty rating (1-5, 5 being hardest)"
    )
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        prof_name = self.professor.name if self.professor else "Unknown"
        return f"Review for {self.course.code} by {prof_name} - {self.rating}/5"
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['course']),
            models.Index(fields=['professor']),
            models.Index(fields=['-created_at']),
        ]
