import React from 'react';

import './style.css';

const ChatWindow = ({ messages }) => (
  <div className='chat_window'>
    <ul className='chat_window__messages'>
      {messages.map((msg, i) => (
        <li
          key={i}
          className={`chat_window__messages__container ${
            msg.self === true ? 'chat_window__messages__container_right' : ''
          }`}
        >
          <div className='chat_window__messages__container__message'>
            <b className='chat_window__messages__container__message__username'>
              {msg.user}
            </b>
            <br />
            {msg.content}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default ChatWindow;
