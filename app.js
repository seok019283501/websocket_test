const express = require('express');
const path = require('path');
const  cors = require('cors');
const websocket = require('./socket.js');
const db = require('./db/db.js');
const app = express();
const {RealTimeCollaborative} = require('./db/schemas/realTimeCollaborative.js')

app.use(cors({ 
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

// OPTIONS 요청에 대한 프리플라이트 처리
app.options('*', cors({ origin: 'http://localhost:3000' }));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname + '/img'));


app.set('port',process.env.PORT || 8000);


app.get('/my', async (req, res) => {
  const existingDocument = await RealTimeCollaborative.findOne({ id: 3 });

  if (!existingDocument) {
    return res.status(404).send('Document not found');
  }

  const update = existingDocument.text;  // Buffer 또는 Uint8Array로 가정

  if (Buffer.isBuffer(update)) {
    res.set('Content-Type', 'application/octet-stream');
    res.send(update);
  } else if (update instanceof Uint8Array) {
    res.set('Content-Type', 'application/octet-stream');
    res.send(update);
  } else {
    res.status(500).send('Unsupported data format');
  }
});

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
db();
websocket(server);

// const express = require('express')
// const bodyParser = require('body-parser')
// const  cors = require('cors');
// const app = express()
// app.use(bodyParser.json())
// app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000'}));



// app.listen(8000, () => {
//   console.log('started')
// })

