# Node-Server-Project

Basic Blog-App Project using Node Js, Prisma ORM, and Express

### To start this project :rocket: -

1. Clone the project from repo
2. Use `npm install` to download node packages
3. Use `npm install prisma --save-dev` to download Prisma.
4. Run this command to create necessary tables `npx prisma migrate dev --name init
`
5. Now you are ready to start the application - `npm start`

### Functionality -

This is a basic blogging application.
In which user can comment on any post, can create posts.  
To create a post or to write comments on any post user has to register himself first after that needs to log in first.

#### Schemas- User, Post, Comment :file_cabinet: -

User - 1 : N - Post  
User - 1 : N - Comment  
Post - 1 : N - Comment

#### Security :closed_lock_with_key: -

Implemented JWT authentication.
The user has to register himself with the Post endpoint - `http://localhost:3000/api/user/create`  
After successful registration user can log in with the same email and password with the Post endpoint - `http://localhost:3000/api/user/login`  
Once the user is logged in then he will get a JWT token in response to authenticate other requests.

#### Used Brcypt library to store Password securely. :key:

### APIs

#### User

Post - `http://localhost:3000/api/user/login`  
Post - `http://localhost:3000/api/user/create`  
Get - `http://localhost:3000/api/user`  
Put - `http://localhost:3000/api/user/:id`  
Delete - `http://localhost:3000/api/user/:id`

#### Post / Blog

Get - `http://localhost:3000/api/post`  
Get - `http://localhost:3000/api/post?page=2&limit=5&search=Java`  
Get- `http://localhost:3000/api/post/:id`  
Post - `http://localhost:3000/api/post`  
Delete - `http://localhost:3000/api/post/:id`

#### Comment

Get - `http://localhost:3000/api/comment`  
Get- `http://localhost:3000/api/comment/:id`  
Post - `http://localhost:3000/api/comment`  
Put - `http://localhost:3000/api/comment/:id`  
Delete - `http://localhost:3000/api/post/:id`
