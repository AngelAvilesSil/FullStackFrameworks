console.log('hello world')

const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

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
                                        <a href="#" class="btn btn-primary">Details</a>
                                    </div>
                                    <div class="col-2">
                                        <a href="#" class="btn btn-primary">${element.liked ? `Unlike (${element.count})`: `Like (${element.count})`}</a>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    `
                });
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

/* We alway need to run this initially at the
creation of the document */
getData()