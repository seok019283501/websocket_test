const websocket = require('ws');
const { WebsocketProvider } = require('y-websocket')
const Y = require('yjs')


  // const ydoc = new Y.Doc()
  // const ytext = ydoc.getText(docId)
  // console.log(ytext)
  // const wsProvider = new WebsocketProvider('ws://localhost:1234', docId, ydoc, { WebSocketPolyfill: require('ws') })
  // wsProvider.on('status', (event) => {
  //   console.log(event.status)
  //   if (event.status === 'connected') {
  //     if (wsProvider.ws) {
  //       if (initContext && initContext.length > 0) {
  //         console.log('write: {}', initContext)
  //         ytext.insert(0, initContext)
  //       }
  //     }
  //   }
  // })

module.exports = (server) => {
  const wss = new websocket.Server( 
    {
        server: server, // WebSocket서버에 연결할 HTTP서버를 지정한다.
        // port: 8080, // WebSocket연결에 사용할 port를 지정한다(생략시, http서버와 동일한 port 공유 사용)
    }
  );
  const ydoc = new Y.Doc()
  const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my', ydoc, { WebSocketPolyfill: require('ws') })
  wsProvider.on('status', (event) => {
      console.log(event)
      
  })

  wsProvider.on('connected', (ws,req) => {
    console.log(event)
    ws.on('message', (msg)=>{
            console.log(msg)
        })
    
  })

  
  wss.on('connection', (ws, request)=>{
    // 1) 연결 클라이언트 IP 취득
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    
    console.log(`새로운 클라이언트[${ip}] 접속`);
    console.log("Asdf")
    // 2) 클라이언트에게 메시지 전송
    // if(ws.readyState === ws.OPEN){ // 연결 여부 체크
    //     ws.send(`클라이언트[${ip}] 접속을 환영합니다 from 서버`); // 데이터 전송
    // }
    // 3) 클라이언트로부터 메시지 수신 이벤트 처리
    ws.on('message', (msg)=>{
        console.log(msg)
        const ydoc = new Y.Doc()
        
    })
    
    console.log(`새로운 유저 : ${request.socket.remoteAddress}`)
    
    // 4) 에러 처러
    ws.on('error', (error)=>{
        console.log(`클라이언트[${ip}] 연결 에러발생 : ${error}`);
    })
    
    // 5) 연결 종료 이벤트 처리
    ws.on('close', ()=>{
        console.log(`클라이언트[${ip}] 웹소켓 연결 종료`);
    })
  });
}

