<p><b>Todos API built with nestJS</b></p>

<p>
  To run the project:
  <ul>
    <li>Install node and mysql to your computer</li>
    <li>
      Create an .env file as the .env.example and enter your mysql configuration information
    </li>
    <li>At the root of the project run <b>npm install</b></li>
    <li>Then run command <b>npm run start</b></li>
    <li>
      Wait to start the project fully, then you can access the route: http://localhost:3000
    </li>
  </ul>  
</p>

<p>
  To practice building rest api's with nestJS, I created an api so users can create and update their todos. Added user authentication with JWT, creation of two user levels, admin who can see the list of all todos, create and update your tasks too, and a common user level which can only list your todos, create and edit them. Migrations were used to create a default administrator user in the database. Added Swagger documentation, facilitating the consumption and general knowledge of the api. Finally, you can test the api, it's hosted on heroku:
</p>

Swagger can be accessed from the path: <b>/api</b>
![Captura de tela de 2021-06-08 15-42-35](https://user-images.githubusercontent.com/38334753/121248603-9f09a080-c871-11eb-882f-24c7e43b3616.png)
<b>On the route access: https://todo-api-nest.herokuapp.com/api/</b>
