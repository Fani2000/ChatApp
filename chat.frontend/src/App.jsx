import { Col, Container, Row } from 'react-bootstrap'
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'

// import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import WaitingRoom from './components/WaitingRoom';
import { useState } from 'react';
import ChatRoom from './components/ChatRoom';


function App() {
  const [conn, setConnection] = useState()
  const [messages, setMessages] = useState([])

  const handleJoin = async (username, chatRoom) => {
    try {

      // Initial a connection http://localhost:5197/
      const conn = new HubConnectionBuilder()
        .withUrl('http://localhost:5197/chat')
        .configureLogging(LogLevel.Information)
        .build();

      // Set up handlers to receive and send messages
      conn.on('JoinSpecificChatRoomMessage', (username, msg) => {
        console.log(username)
        console.log("msg: ", msg)
        setMessages(messages => [...messages, { username, msg }])
      })

      conn.on('ReceiveSpecificMessage', (username, msg) => {
        console.log("MESSAGE: ", msg)
        setMessages(messages => [...messages, { username, msg }])
      })

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", { username, chatRoom })

      setConnection(conn)

    } catch (error) {
      console.log("ERROR: ", error)
    }
  }

  const SendMessage = async (message) => {
    try {
      await conn.invoke('SendMessage', message)
    } catch (error) {
      console.log("ERROR: ", error)
    }
  }

  return (
    <div>
      <main>
        <Container>
          <Row className="px-5 my-5">
            <Col sm="12">
              <h1 className='font-weght-light'>Welcome Chat</h1>
            </Col>
          </Row>
          {!conn ? (

            <WaitingRoom joinChatRoom={handleJoin} />
          ) : (
            <ChatRoom messages={messages} sendMessage={SendMessage} />
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
