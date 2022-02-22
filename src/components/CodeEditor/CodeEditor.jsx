import React, { useContext, useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/xcode';
import { ChannelsContext } from '../ChannelsContext';

export default function CodeEditor() {
  const [code, setCode] = useState('');
  const { socket } = useContext(ChannelsContext);

  useEffect(() => {
    if (!socket) return;

    socket.on('codeChange', (commonCode) => {
      setCode(commonCode);
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
