# The full stack frameworks network application
This project simulates a web application; it precisely simulates a social media app.

## Some highlights
- Uses Python virtual environments.
- It uses the Django database and handles image files.
- Uses Django templates, HTML, javascript, ajax calls and JSON queries
- Can be deployed through AWS EC2, Azure Virtual Machine, or any other method.
- Handles users and their posts as any other social media.
- All posts are stored in a database containing the same contents as the repo.

## How to run it
- Consider that the computer running this will act as a server.
- You need asgiref 3.6.0, Django 4.2, django-crispy-forms 2.0, Pillow 9.5.0, sqlparse 0.4.3, tzdata 2023.3 to run it successfully.
- Open CMD, navigate to `dj_ajax\Scripts`, then type `activate.bat.`
- Navigate to `dj_ajax\src` and type `py manage.py runserver localhost:[PORT]`. Replace the PORT for your desired (8001 is okay).
- In a new CMD pointing to dj_ajax\Scripts, type `python manage.py changepassword armando` and type your desired password.
- In a browser, open your selected address, localhost:port.
- Enter `armando` as user and the password you entered, this is the admin user.
- You can go to the site from the server itself, create more users to distribute to other computers in the same network and enjoy!!
