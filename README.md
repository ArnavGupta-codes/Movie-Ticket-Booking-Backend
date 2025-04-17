# Movie-Ticket-Booking-Backend

The deployed link of the portal: https://movie-ticket-booking-backend-41em.onrender.com/

Also then to check the deployement and the project:
Use a platform such as Postman, then:
Make different request:

1)Registration of a user:
POST REQUEST: https://movie-ticket-booking-backend-41em.onrender.com/api/auth/register
Add a json body: {"username": "usenameee", "password": "passwordd"}
Then Save and Send the request
Person will get a token code and the user is registered which is important, else it shows user already exists.

2)User Login:
POST REQUEST: https://movie-ticket-booking-backend-41em.onrender.com/api/auth/login
Add a json Body: {"username": "usenameee", "password": "passwordd"}
Then Save and Send the Request
Person will get a token again

3)Admin Login: 
POST REQUEST: https://movie-ticket-booking-backend-41em.onrender.com/api/auth/admin/login
Add a json Body: {
    "username": "admin",
    "password": "123456"
}
There is only 1 admin given here....
And you will receive a token corresponding to token of the admin.

4)Add Movies:
POST REQUEST: https://movie-ticket-booking-backend-41em.onrender.com/api/movies
Then in the Headers section: Add Authorization with a Bearer <token admin>
and a Content-type with multipart/form-data
then in the header add 
![image](https://github.com/user-attachments/assets/1cd3912d-0384-4f2d-9404-4f5709a6bb77)
Save and Send then it will add the movie and gives tokens and other details

5)Get Movies:
GET REQUEST: https://movie-ticket-booking-backend-41em.onrender.com/api/movies
Directly Save and Send the Request it will show all the movies with id's and other details regarding the movie
This doesn't requires Authorization.

6)Make Bookings:
POST REQUEST: https://movie-ticket-booking-backend-41em.onrender.com/api/bookings
