const express = require('express');
const bodyParse = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const logger = require('./src/logger');

const routesAuth = express.Router();
const app = express();

app.set('llave', config.key);

app.use(bodyParse.urlencoded({ extended: true }));

app.use(bodyParse.json());
app.use(logger);

app.listen(3000, () => {
  console.log('server running in port 3000');
});

app.get('/', (req, res) => {
  res.send('home');
})

app.post('/login', (req, res) => {
  const { body: { email, password } } = req;

  if (email === 'river' && password === 'river') {
    const token = jwt.sign({ check: true }, app.get('llave'), { expiresIn: 1440 });
    res.json({
      message: 'sucess',
      token,
    });
  } else {
    res.status(403).json({
      message: 'Error: email or password are incorrect.',
    });
  }
});

const auth = (req, res, next) => {
  const { headers: { 'access-token': token } } = req;
  if (token) {
    console.log('auth----')
    console.log(token);
    jwt.verify(token, app.get('llave'), (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Error: Unauthorized'
        })
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    res.status(400).json({
      message: 'Error: Token wasn\'t send',
    });
  }
}

routesAuth.use((req, res, next) => {
  const { headers: { 'access-token': token } } = req;
  if (token) {
    jwt.verify(token, app.get('llave'), (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Unauthorized'
        })
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    res.status(400).json({
      message: 'bad request',
    });
  }
})

app.get('/products', auth, (req, res) => {
  res.json({
    id: 1,
    name: 'river campeon',
  });
});

app.get('/users', auth, (req, res) => {
  res.json({
    users: [
      {
        email: 'test@test.ca',
      },
      {
        email: 'test2@test.ca',
      },
    ],
  });
});