from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs':qs})

def load_post_data_view(request, num_posts):
    visible = 3                             # how many posts to show
    upper = num_posts                       # the upper number of posts to show
    lower = upper - visible                 # the lower number of posts to show
    size = Post.objects.all().count()

    qs = Post.objects.all()
    data = []   # where we will store the data to display
    # filtering and arranging the deta to be displayed
    for obj in qs:
        item = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'liked': True if request.user in obj.liked.all() else False,
            'author': obj.author.user.username
        }
        # injecting the objects into the data which will
        # be returned as a JSON object
        data.append(item)
    return JsonResponse({'data':data[lower:upper], 'size':size})

def hello_world_view(request):
    return JsonResponse({'text' : 'hello world'})