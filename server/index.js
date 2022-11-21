require('dotenv').config()
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const { Pool, Client } = require('pg');
const connectionString = process.env.REACT_APP_URI;

console.log(process.env.NODE_ENV)
console.log(process.env.PORT)
console.log(process.env.REACT_APP_URI)


const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})


// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {

    const username = req.query.username
    let exists = false
    //const score = parseInt(req.query.score)
    //Need to work on decimal values
    //const time = parseFloat(req.query.time)

    pool.connect()
      .then(client => {

        //VALIDATE USERNAME
        client
          .query(`select exists (select * from userdb where access_code = \'${username}\')`)
          .then(qres => {
            if (qres.rows[0].exists) {
              exists = true;

              client.query(`select exists (select * from userdb where access_code = \'${username}\' and is_complete = 'true')`)
                .then(qres => {
                  if (qres.rows[0].exists) {
                    res.set('Content-Type', 'application/json');
                    res.send({ "message": "You've already completed this quiz." });
                  }
                  else {
                    res.set('Content-Type', 'application/json');
                    res.send({ "message": qres.rows[0].exists });
                  }
                })
                .then(() => {
                  client.release();
                  console.log("CONNECTION ENDED")
                })
                .catch(e => {
                  client.release();
                  console.error(e.stack);
                })

            }
            else {
              res.set('Content-Type', 'application/json');
              res.send({ "message": "User doesn't exist. Contact test administrator for assistance." });
              client.release();
              console.log("CONNECTION ENDED")
            }
          })

        /*
          .query('select * from userdb')
           .query('select username from userdb')
         .query('insert into userdb (username) values (\'steve\')')
         */
      })
  });

  app.get('/apidone', function (req, res) {
    const accesscode = req.query.username
    const answers = req.query.ansArray

    const answersData = JSON.parse(answers)

    var answersSend = new Array(80).fill(0);
    var sum = 0;

    for (var i in answersData) {
      answersSend[i] = answersData[i].value;
      sum += answersSend[i];
    }

    //console.log(`${accesscode} and ${answersSend}`)

    if (accesscode == 'admin') {
      pool.connect()
        .then(client => {
          client
            .query(`update userdb set score = ${sum}, is_complete = 'false', answers = ARRAY [${answersSend}] where access_code = \'${accesscode}\'`)
            .then(() => {
              client.release();
              console.log("CONNECTION ENDED")
            })
            .catch(e => {
              client.release();
              console.error(e.stack);
            })

        })
    }
    else {
      pool.connect()
        .then(client => {
          client
            .query(`update userdb set score = ${sum}, is_complete = 'true', answers = ARRAY [${answersSend}] where access_code = \'${accesscode}\'`)
            .then(() => {
              client.release();
              console.log("CONNECTION ENDED")
            })
            .catch(e => {
              client.release();
              console.error(e.stack);
            })

        })
    }
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
  });
}
