console.log('hello world')

/* These are the elements from the main page */
const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

/* These are the elements from the post screen
prompted when trying to enter a new post */
const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const url = window.location.href

/* This is the alert box that will inform if a post was succesful
or not */
const alertBox = document.getElementById('alert-box')

const dropzone= document.getElementById('my-dropzone')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]

/* Getting the cross site request forgery protection
taken from django documentation
https://docs.djangoproject.com/en/4.1/howto/csrf/#using-csrf */
const getCookie =(name)=> {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


const deleted = localStorage.getItem('title')
if (deleted) {
    handleAlerts('danger', `Deleted "${deleted}"`)
    localStorage.clear()
}


/* Getting the array of forms of all the like and unlikes from the posts */
const likeUnlikePosts =()=>{
    const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-forms")]
    likeUnlikeForms.forEach(form=> form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: 'POST',
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response){
                console.log(response)
                clickedBtn.textContent = response.liked ? `Unlike (${response.count})`: `Like (${response.count})`
            },
            error: function(error){
                console.log(error)
            }
        })

    }))
}


let visible = 3

/* This function will run in a button, so lets wrap it in a function */
const getData = () => {
    /* ajax call that will get all the list of post to be shown in
    the post page in the browser */
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`,
        success: function(response){
            console.log(response)
            const data = response.data
            setTimeout(()=>{
                spinnerBox.classList.add('not-visible')
                console.log(data)
                data.forEach(element => {
                    postsBox.innerHTML += `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">${element.body}</p>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-2">
                                        <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                                    </div>
                                    <div class="col-2">
                                        <form class="like-unlike-forms" data-form-id="${element.id}">
                                            <button class="btn btn-primary" id="like-unlike-${element.id}">
                                                ${element.liked ? `Unlike (${element.count})`: `Like (${element.count})`}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                likeUnlikePosts()
            }, 500)
            console.log(response.size)
            if (response.size === 0) {
                endBox.textContent = 'No post added yet...'
            }
            else if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'No more posts to load...'
            }

        },
        error: function(error){
            console.log(error)
        }
    })
}

loadBtn.addEventListener('click', ()=>{
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()   // need to run it every time button is pressed
})


let newPostId = null
postForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value,
        },
        success: function(response){
            console.log(response)
            newPostId = response.id
            postsBox.insertAdjacentHTML('afterbegin', `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${url}${response.id}" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">
                                <form class="like-unlike-forms" data-form-id="${response.id}">
                                    <button class="btn btn-primary" id="like-unlike-${response.id}">
                                        Like (0)
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            likeUnlikePosts()
            // $('#addPostModal').modal('hide')
            handleAlerts('success', 'New post added!')
            // postForm.reset()
        },
        error: function(error){
            console.log(error)
            handleAlerts('danger', 'ooops!...something went wrong')
        }
    })
})

/* Event listener for the add button making the
dropzone invisible until the post is submitted */
addBtn.addEventListener('click', ()=>{
    dropzone.classList.remove('not-visible')
    addBtn.classList.add('not-visible')
})

/* The modal form will be reset only after clicking any
of the clossing buttons */
closeBtns.forEach(btn=> btn.addEventListener('click', ()=>{
    postForm.reset()
    if (addBtn.classList.contains('not-visible')) {
        addBtn.classList.remove('not-visible')
    }
    if (!dropzone.classList.contains('not-visible')) {
        dropzone.classList.add('not-visible')
    }
    const myDropzone = Dropzone.forElement("#my-dropzone")
    myDropzone.removeAllFiles(true)
}))

Dropzone.autoDiscover = false
const myDropzone = new Dropzone('#my-dropzone', {
    url: 'upload/',
    init: function() {
        this.on('sending', function(file, xhr, formData){
            formData.append('csrfmiddlewaretoken', csrftoken)
            formData.append('new_post_id', newPostId)
        })
    },
    maxFiles: 5,
    maxFilesize: 4,
    acceptedFiles: '.png, .jpg, .jpeg'
})

/* We always need to run this initially at the
creation of the document */
getData()