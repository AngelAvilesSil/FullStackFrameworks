from django.shortcuts import render
from .models import Post, Photo
from django.http import JsonResponse, HttpResponse
from .forms import PostForm
from profiles.models import Profile
from .utils import action_permission
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

# Create your views here.

# creation of the view, it will render the url
@login_required
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


# This function will aid on the display of the
# detailed view from the posts
@login_required
def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form,
    }

    return render(request, 'posts/detail.html', context)



# This function will gather the actual contents of a
# post and will return them as a json response
@login_required
def post_detail_data_view(request, pk):
    if ajax_view(request):
        obj = Post.objects.get(pk=pk)
        data = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'author': obj.author.user.username,
            'logged_in': request.user.username,
        }
        return JsonResponse({'data': data})
    return redirect('posts:main-board')


# This will help on loading the lists of existing
# posts, will take into account 3 posts and support
# increase of 3 posts every time it is triggered
@login_required
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
@login_required
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
    return redirect('posts:main-board')



# This is the function that get the information for updating
# the posts, should return a JsonResponse
@login_required
@action_permission
def update_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if ajax_view(request):
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')
        obj.title = new_title
        obj.body = new_body
        obj.save()
        return JsonResponse({
            'title': new_title,
            'body': new_body,
        })
    return redirect('posts:main-board')
    


# This is the functions that get object that must be deleted
# returns an empty JsonResponse
@login_required
@action_permission
def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if ajax_view(request):
        obj.delete()
        return JsonResponse({})
    return JsonResponse({'msg':'access denied'})
    


# This is the function that will handle the upload of files to
# the posts
@login_required
def image_upload_view(request):
    print(request.FILES)
    if request.method == 'POST':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(image=img, post=post)
    return HttpResponse()



# due to is_ajax being deprecated, I am doing my own
# version of the same check that should do the same
def ajax_view(request):
    is_ajax = request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
    # Get requested data and create data dictionary
    return is_ajax
