import React, { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/xcode';
import PropTypes from 'prop-types';
import { ChannelsContext } from '../ChannelsContext';

export default function CodeEditor({ currUser }) {
  const [code, setCode] = useState('');
  const { socket } = useContext(ChannelsContext);

  useEffect(() => {
    if (!socket) return;

    socket.on('codeChange', ({ commonCode, author }) => {
      if (author !== currUser) {
        setCode(commonCode);
        console.log('not match');
      } else {
        console.log('match');
      }
    });
  }, [socket]);

  const codeChange = (v) => {
    socket.emit('codeChange', v);
  };

  return (
    <AceEditor
      placeholder="Your code will appear here"
      mode="javascript"
      theme="xcode"
      name="blah2"
      fontSize={14}
      className="ace__container"
      showPrintMargin
      showGutter
      onChange={codeChange}
      highlightActiveLine
      value={code}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}

CodeEditor.propTypes = {
  currUser: PropTypes.string.isRequired,
};
