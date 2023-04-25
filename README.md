# Backend First Project
## Delivery App
### Description

Project made for the course "Backend Web Development" at Universidad del Norte. It's an application that functions similar to most food delivery applications. It is made with Node, JavaScript, Express and MongoDB.

## Installation
Clone the repository in your local desk.

### Steps

1. Clone the repository
2. Open in your favorite IDE
3. Install the dependencies in a terminal
```
npm i
```
4. Create nodemon.json file in this direction
 * [controllers]
 * [models]
 * [node_modules]
 * [routes]
 * [.babelrc]
 * [.gitignore]
 * [app.js]
 * [**nodemon.json**]
 * [package.json]
 * [README.md]
 
Write in nodemon.json the access credentials to your database in mongodb
```
{
	"env": {

		"MONGO_USER": "your_user",

		"MONGO_PASS": "your_password"

	}
}
```
5. Open a new terminal and run it
```
npm run start
```
