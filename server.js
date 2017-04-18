/* eslint-disable no-param-reassign */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/api/sandwiches', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/sandwiches', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const sandwiches = JSON.parse(data);
    const newSandwich = {
      customer: req.body.customer,
      ingredients: req.body.ingredients,
      id: req.body.id,
    };
    sandwiches.push(newSandwich);
    fs.writeFile(DATA_FILE, JSON.stringify(sandwiches, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(sandwiches);
    });
  });
});

app.put('/api/sandwiches', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const sandwiches = JSON.parse(data);
    sandwiches.forEach((sandwich) => {
      if (sandwich.id === req.body.id) {
        sandwich.customer = req.body.customer;
        sandwich.ingredients = req.body.ingredients;
      }
    });
    fs.writeFile(DATA_FILE, JSON.stringify(sandwiches, null, 4), () => {
      res.json({});
    });
  });
});

app.delete('/api/sandwiches', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    let sandwiches = JSON.parse(data);
    sandwiches = sandwiches.reduce((memo, sandwich) => {
      if (sandwich.id === req.body.id) {
        return memo;
      } else {
        return memo.concat(sandwich);
      }
    }, []);
    fs.writeFile(DATA_FILE, JSON.stringify(sandwiches, null, 4), () => {
      res.json({});
    });
  });
});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
