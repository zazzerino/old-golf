import React from 'react';
import { ChatMessage, User } from './types';
import { sendChatMessage } from './websocket';

function ChatMessageDisplay(props: { userId: number, userName: string, text: string }) {
  const { userId, userName, text } = props;

  return (
    <div className="ChatMessage">
      <span className="chat-user-name">{userName}</span>
      <span className="chat-user-id">{`(${userId}): `}</span>
      <span className="chat-text">{text}</span>
    </div>
  );
}

interface ChatProps {
  user: User;
  gameId: number;
  messages: ChatMessage[];
}

export function Chat(props: ChatProps) {
  const { user, gameId, messages } = props;
  const [userInput, setUserInput] = React.useState('');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const chatBox = ref.current;

    if (chatBox) {
      const height = chatBox.scrollHeight;
      chatBox.scrollTo(0, height);
    }
  });

  return (
    <div className="Chat">
      <h4>Chat</h4>
      <div className="chat-box" ref={ref}>
        {messages.map((msg, key) => {
          return <ChatMessageDisplay key={key} userId={msg.userId} userName={msg.userName} text={msg.text} />
        })}
        <input
          placeholder="Type message"
          value={userInput}
          onChange={event => setUserInput(event.target.value)}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              sendChatMessage(gameId, user.id, user.name, userInput);
              setUserInput('');
            }
          }}
        />
      </div>
    </div>
  )
}
