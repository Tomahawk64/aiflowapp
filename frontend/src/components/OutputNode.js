import React from 'react';
import { Handle, Position } from 'reactflow';

function OutputNode({ data }) {
  const renderContent = () => {
    if (data.loading) {
      return (
        <div className="loading-wrapper">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <span className="loading-label">Generating response…</span>
        </div>
      );
    }
    if (data.reply) {
      return <p className="reply-text">{data.reply}</p>;
    }
    return (
      <div className="placeholder-wrapper">
        <span className="placeholder-icon">🤖</span>
        <p className="placeholder-text">
          AI response will appear here after you run the flow.
        </p>
      </div>
    );
  };

  return (
    <div className="custom-node output-node">
      <Handle type="target" position={Position.Left} id="in" />

      <div className="node-header">
        <div className="node-header-icon">🤖</div>
        <div className="node-header-text">
          <span className="node-header-title">AI Response</span>
          <span className="node-header-sub">LLaMA 3.1 · Groq</span>
        </div>
        <span className="node-header-badge">Node 2</span>
      </div>

      <div className="node-body">{renderContent()}</div>

      <div className="node-footer">
        <span className="char-count">
          {data.reply ? `${data.reply.length} chars` : '—'}
        </span>
        <span className="node-tag">AI Output</span>
      </div>
    </div>
  );
}

export default OutputNode;
