import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

function InputNode({ data }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    data.onChange(e.target.value);
  };

  return (
    <div className="custom-node input-node">
      <div className="node-header">
        <div className="node-header-icon">✏️</div>
        <div className="node-header-text">
          <span className="node-header-title">Prompt Input</span>
          <span className="node-header-sub">User message</span>
        </div>
        <span className="node-header-badge">Node 1</span>
      </div>

      <div className="node-body">
        <textarea
          className="node-textarea"
          value={value}
          onChange={handleChange}
          placeholder="Type your prompt here… Ask anything you'd like the AI to answer."
          rows={5}
        />
      </div>

      <div className="node-footer">
        <span className="char-count">{value.length} chars</span>
        <span className="node-tag">Text Input</span>
      </div>

      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
}

export default InputNode;
