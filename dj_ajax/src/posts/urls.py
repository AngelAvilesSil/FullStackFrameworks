from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    hello_world_view
)

app_name = 'posts'

# this is how the urls will be build when doing requests in the browser
urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('data/<int:num_posts>/', load_post_data_view, name='post-data'),

    path('hello-world/', hello_world_view, name='hello-world')
]