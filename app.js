const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res, next) => {
  res.render('login', {});
});

app.post('/login', (req, res, next) => {
  let password = req.body.password;
  let username = req.body.username;
  const data = fs.readFileSync(
    path.join(__dirname, 'data', 'users.json'),
    'utf-8'
  );
  const parsedData = [...JSON.parse(data)];
  parsedData.forEach((userObj) => {
    if (password === userObj.password && username === userObj.username) {
      res.redirect(redirectAuthenticated(userObj.id, username));
    }
  });
});

function redirectAuthenticated(id, username) {
  let data;
  console.log(id);
  app.get(`/${id}`, (req, res, next) => {
    console.log('authenticated');
    data = res.send(`Authenticated successfully. Welcome, ${username}`);
  });
  return id;
}

app.get('/register', (req, res, next) => {
  res.render('register', {});
});

app.post('/register', (req, res, next) => {
  if (req.body.password[0] === req.body.password[1]) {
    let userData = [];
    const credentials = {
      username: req.body.username,
      password: req.body.password[0],
      id: Math.random(),
    };
    const userInformation = fs.readFileSync(
      path.join(__dirname, 'data', 'users.json'),
      'utf-8'
    );
    userData = [...JSON.parse(userInformation)];
    userData.push(credentials);
    fs.writeFile(
      path.join(__dirname, 'data', 'users.json'),
      JSON.stringify(userData),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }
  res.redirect('/login');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
