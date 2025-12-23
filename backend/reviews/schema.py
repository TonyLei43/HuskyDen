import graphene
from graphene_django import DjangoObjectType, DjangoConnectionField
from .models import Course, Professor, Review, Department


class DepartmentType(DjangoObjectType):
    class Meta:
        model = Department
        fields = "__all__"
        interfaces = (graphene.relay.Node,)


class CourseType(DjangoObjectType):
    avg_rating = graphene.Float()
    avg_workload = graphene.Float()
    avg_difficulty = graphene.Float()
    reviews = graphene.List(lambda: ReviewType)
    
    class Meta:
        model = Course
        fields = "__all__"
        interfaces = (graphene.relay.Node,)
        filter_fields = {
            "code": ["exact", "icontains"],
            "title": ["icontains"],
            "department__code": ["exact"],
        }
    
    def resolve_reviews(self, info):
        return self.reviews.all()
    
    def resolve_avg_rating(self, info):
        return self.avg_rating
    
    def resolve_avg_workload(self, info):
        return self.avg_workload
    
    def resolve_avg_difficulty(self, info):
        return self.avg_difficulty


class ProfessorType(DjangoObjectType):
    avg_rating = graphene.Float()
    reviews = graphene.List(lambda: ReviewType)
    
    class Meta:
        model = Professor
        fields = "__all__"
        interfaces = (graphene.relay.Node,)
        filter_fields = {
            "name": ["icontains"],
            "department__code": ["exact"],
        }
    
    def resolve_avg_rating(self, info):
        return self.avg_rating
    
    def resolve_reviews(self, info):
        return self.reviews.all()


class ReviewType(DjangoObjectType):
    class Meta:
        model = Review
        fields = "__all__"
        interfaces = (graphene.relay.Node,)
        filter_fields = {
            "course__code": ["exact"],
            "professor__id": ["exact"],
        }


class CreateReviewInput(graphene.InputObjectType):
    course_code = graphene.String(required=True)
    professor_id = graphene.Int(required=False)
    rating = graphene.Int(required=True)
    workload = graphene.Int(required=True)
    difficulty = graphene.Int(required=True)
    comment = graphene.String(required=False)


class CreateReview(graphene.Mutation):
    class Arguments:
        input = CreateReviewInput(required=True)
    
    review = graphene.Field(ReviewType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)
    
    def mutate(self, info, input):
        errors = []
        
        try:
            course = Course.objects.get(code=input.course_code)
        except Course.DoesNotExist:
            errors.append(f"Course {input.course_code} not found")
            return CreateReview(success=False, errors=errors, review=None)
        
        professor = None
        if input.professor_id:
            try:
                professor = Professor.objects.get(id=input.professor_id)
            except Professor.DoesNotExist:
                errors.append(f"Professor with id {input.professor_id} not found")
                return CreateReview(success=False, errors=errors, review=None)
        
        # Validate rating values
        if not (1 <= input.rating <= 5):
            errors.append("Rating must be between 1 and 5")
        if not (1 <= input.workload <= 5):
            errors.append("Workload must be between 1 and 5")
        if not (1 <= input.difficulty <= 5):
            errors.append("Difficulty must be between 1 and 5")
        
        if errors:
            return CreateReview(success=False, errors=errors, review=None)
        
        review = Review.objects.create(
            course=course,
            professor=professor,
            rating=input.rating,
            workload=input.workload,
            difficulty=input.difficulty,
            comment=input.comment or "",
        )
        
        return CreateReview(success=True, errors=[], review=review)


class Query(graphene.ObjectType):
    # Course queries
    course = graphene.Field(CourseType, code=graphene.String(required=True))
    courses = DjangoConnectionField(CourseType)
    
    # Professor queries
    professor = graphene.Field(ProfessorType, id=graphene.Int(required=False), slug=graphene.String(required=False))
    professors = DjangoConnectionField(ProfessorType)
    
    # Review queries
    reviews = DjangoConnectionField(ReviewType)
    
    # Department queries
    departments = DjangoConnectionField(DepartmentType)
    
    def resolve_course(self, info, code):
        try:
            return Course.objects.get(code=code)
        except Course.DoesNotExist:
            return None
    
    def resolve_courses(self, info, **kwargs):
        return Course.objects.all()
    
    def resolve_professor(self, info, id=None, slug=None):
        try:
            if slug:
                return Professor.objects.get(slug=slug)
            elif id:
                return Professor.objects.get(id=id)
            else:
                return None
        except Professor.DoesNotExist:
            return None
    
    def resolve_professors(self, info, **kwargs):
        return Professor.objects.all()
    
    def resolve_reviews(self, info, **kwargs):
        return Review.objects.all()
    
    def resolve_departments(self, info, **kwargs):
        return Department.objects.all()


class Mutation(graphene.ObjectType):
    create_review = CreateReview.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)

