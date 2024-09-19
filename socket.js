const { WebsocketProvider } = require('y-websocket');
const ws = require('ws');
const Y = require('yjs');
const {RealTimeCollaborative} = require('./db/schemas/realTimeCollaborative.js')
// const realTimeCollaborative = require('./db/schemas/realTimeCollaborative.js')

module.exports = (server) => {
  console.log(ws);
  // Yjs 문서 및 WebSocket Provider 설정
  const ydoc = [new Y.Doc(),new Y.Doc];

  // const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', ydoc, { 
  //   WebSocketPolyfill: require('ws'),
  // });
  let wsProviderList = [
    new WebsocketProvider('ws://localhost:1234', 'my-roomname', ydoc[0], { 
    WebSocketPolyfill: ws})
  ,new WebsocketProvider('ws://localhost:1234', '2', ydoc[1], { 
    WebSocketPolyfill: ws,
  })];
  wsProviderList.forEach((wsProvider,index)=>{
    // 연결 상태 로그
  wsProvider.on('status', async(event) => {
    // const existingDocument = await RealTimeCollaborative.findOne({ id: 3 });
    // let count = 0;
    // let text = '';
    // const uint8Array = new Uint8Array(existingDocument.text);
    // Y.applyUpdate(ydoc[index], uint8Array);
    // // console.log(uint8Array);
    // console.log(existingDocument.text)
    // if(event.status == 'connected' && count === 0){
    //   count +=1;
      
    //   const text = ydoc[index].getText('my-text');

    //   text.insert(0,existingDocument.text)
    // }

    console.log(`Connection status: ${event.status}`);
    wsProvider.ws.on('message', async(message) => {
      // console.log('Received raw message:', message);
    // wsProvider.ws.send(text)
      
      // let update;
      // if (message instanceof ArrayBuffer) {
      //   update = new Uint8Array(message);
      // } else if (Buffer.isBuffer(message)) {
      //   update = new Uint8Array(message);
      // } else {
      //   console.error('Unexpected message format:', typeof message);
      //   return;
      // }
      const update = Y.encodeStateAsUpdate(ydoc[index]);
      // console.log(update)
      // console.log(JSON.stringify(Y.decodeUpdate(update).structs))
      // const buffer = Buffer.from(update);
      // RealTimeCollaborative.create({id:3, name:'my-room3',text:buffer})
      // console.log(JSON.parse(existingDocument.text))
      try {
        // Yjs 문서 업데이트 적용
        // Y.applyUpdate(ydoc[index], new Uint8Array(JSON.parse(existingDocument.text)));
        // console.log('Document updated successfully');
        // console.log(existingDocument.text);
        // Yjs 문서 내용 출력 (텍스트로 변환)
        // console.log(text.toString());
        // const text = ydoc[index].getText('default');
        
        // console.log(text)
        // console.log('Document content:', text.toString());

      } catch (error) {
        console.error('Error applying update:', error);
      }
    });

  });
  // Yjs 문서가 동기화될 때 발생하는 이벤트
  wsProvider.on('sync', (isSynced) => {
    console.log(`Document is synced: ${isSynced}`);
  });
  })
  

};