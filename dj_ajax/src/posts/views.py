from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile

# Create your views here.

# creatopm of the view, it will render the url
def post_list_and_create(request):
    form = PostForm(request.POST or None)

    if ajax_view(request):
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title': instance.title,
                'body': instance.body,
                'author': instance.author.user.username,
                'id': instance.id,
            })
                       
    context = {
        'form': form,
    }

    return render(request, 'posts/main.html', context)

# This will help on loading the lists of existing
# posts, will take into account 3 posts and support
# increase of 3 posts every time it is triggered
def load_post_data_view(request, num_posts):
    if ajax_view(request):
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
                'count': obj.like_count,
                'author': obj.author.user.username
            }
            # injecting the objects into the data which will
            # be returned as a JSON object
            data.append(item)
        return JsonResponse({'data':data[lower:upper], 'size':size})

# This will handle the likes and unlikes on the posts, the function will
# gather the current status of the posts regarding likes and unlikes count and
# return them in a JSON response
def like_unlike_post(request):
    if ajax_view(request):
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})


# due to is_ajax being deprecated, I am doing my own
# version of the same check that should do the same
def ajax_view(request):
    is_ajax = request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
    # Get requested data and create data dictionary
    return is_ajax


def hello_world_view(request):
    return JsonResponse({'text' : 'hello world'})