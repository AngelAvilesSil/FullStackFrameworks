console.log('hello world detail')

/* Elements that will handle the elements from the details
page of every post */
const postBox = document.getElementById('post-box')
const alertBox = document.getElementById('alert-box')
const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

/* Url for retrieving, updating and deleting posts */
const url = window.location.href + "data/"
const updateUrl = window.location.href + "update/"
const deleteUrl = window.location.href + "delete/"
const csrf = document.getElementsByName('csrfmiddlewaretoken')

/* Forms */
const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')

/* Spome input elemets used int the page */
const spinnerBox = document.getElementById('spinner-box')
const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')


/* This ajax will make the elements such as buttons
visibles as per the user seeing the posts */
$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log(response)
        const data = response.data

        if (data.logged_in !== data.author) {
            console.log('different')
        } else {
            console.log('the same')
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }

        const titleEl = document.createElement('h2')
        titleEl.setAttribute('class', 'mt-3')
        titleEl.setAttribute('id', 'title')

        const authorEl = document.createElement('h5')
        authorEl.setAttribute('class', 'mt-1')
        authorEl.setAttribute('id','author')

        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class', 'mt-1')
        bodyEl.setAttribute('id', 'body')

        titleEl.textContent = data.title
        authorEl.textContent = 'by ' + data.author
        bodyEl.textContent = data.body
        
        postBox.appendChild(titleEl)
        postBox.appendChild(authorEl)
        postBox.appendChild(bodyEl)

        titleInput.value = data.title
        bodyInput.value = data.body

        spinnerBox.classList.add('not-visible')
    },
    error: function(error){
        console.log(error)
    }
})



/* Listening for the submit event that should trigger
the update of the post as per the contents in the modal */
updateForm.addEventListener('submit', e=>{
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById('body')

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': titleInput.value,
            'body': bodyInput.value,
        },
        success: function(response){
            console.log(response)
            handleAlerts('success', 'Post has been updated')
            title.textContent = response.title
            body.textContent = response.body
        },
        error: function(error){
            console.log(error)
        }
    })
})



/* Listening for the submit event that should trigger
the deletion of the post */
deleteForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
        },
        success: function(response){
            window.location.href = window.location.origin
            localStorage.setItem('title', titleInput.value)
        },
        error: function(error){
            console.log(error)
        }
    })
})