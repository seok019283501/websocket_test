const express = require('express');
const path = require('path');
const  cors = require('cors');
const websocket = require('./socket.js');


const app = express();

app.use(express.static(path.join(__dirname,'public')));
app.use(cors());
app.use(express.static(__dirname + '/img'));

app.use(cors({ origin: 'http://localhost:3000'}));

app.set('port',process.env.PORT || 1234);

app.use((req,res,next)=>{
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  res.status(404).json({
      code:404,
      massage:'Not Found',
  });

  next(err);
});
app.use((err,req,res,next)=>{
  res.locals.message = err.message;
  res.locals.error = process.env.NOSD_ENV !== 'production' ? err:{};
  
})
const server = app.listen(app.get('port'),()=>{
  console.log(app.get('port'),'번 포트에서 대기중');
})

websocket(server);

// const express = require('express')
// const bodyParser = require('body-parser')
// const  cors = require('cors');
// const app = express()
// app.use(bodyParser.json())
// app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000'}));

// app.post('/my', (req, res) => {
//   const docId = req.body.doc_id
//   const projectId = req.body.project_id
//   const initContext = req.body.file_content
//   console.log(docId, projectId, initContext)
//   initTpl(docId, projectId, initContext)
//   res.send('success')
// })

// app.listen(8000, () => {
//   console.log('started')
// })

