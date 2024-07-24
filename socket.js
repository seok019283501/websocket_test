const websocket = require('ws');

module.exports = (server) => {
  const wss = new websocket.Server( 
    {
        server: server, // WebSocket서버에 연결할 HTTP서버를 지정한다.
        // port: 8080, // WebSocket연결에 사용할 port를 지정한다(생략시, http서버와 동일한 port 공유 사용)
    }
  );
  const rooms = [];
  wss.on('connection', (ws, request)=>{
    const url = request.url.split("/");
    const room = url[3];
    if(room === 'list'){
      console.log("sdf")
      rooms.forEach((item,index)=>{
        ws.send(index);
      })
    }
    // 1) 연결 클라이언트 IP 취득
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    
    console.log(`새로운 클라이언트[${ip}] 접속`);
    
    // 2) 클라이언트에게 메시지 전송
    // if(ws.readyState === ws.OPEN){ // 연결 여부 체크
    //     ws.send(`클라이언트[${ip}] 접속을 환영합니다 from 서버`); // 데이터 전송
    // }
    // 3) 클라이언트로부터 메시지 수신 이벤트 처리
    ws.on('message', (msg)=>{
        console.log(`클라이언트[${ip}]에게 수신한 메시지 : ${msg}`);
        const jsonMsg = JSON.parse(msg) 
        const action = jsonMsg.action
        const room = jsonMsg.roomId
        console.log("room : "+room)
        console.log('action : '+ action)
        
        //방 생성
        if(action === 'create'){
          rooms[room] = new Set();
          wss.clients.forEach((client,index)=>{

            client.send(room);
          })
        }else if(action === 'join'){ // 방 참여
          console.log(rooms)

          rooms[room].add(ws);
          rooms.forEach((clients,index)=>{
            console.log(typeof(index) +" : "+typeof(room))
            if(room == index){
              clients.forEach((client)=>{
                client.send(`새로운 유저 접속. 현재 유저 ${clients.size} 명`)
              })
            }
            
          })
        }else if(action === 'message'){
          rooms.forEach((clients,index)=>{
            if(room == index){
              clients.forEach((client)=>{
                client.send(jsonMsg.message)
              })
            }
            
          })
        }
        
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

