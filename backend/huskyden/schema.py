import graphene
import reviews.schema


class Query(reviews.schema.Query, graphene.ObjectType):
    pass


class Mutation(reviews.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)

