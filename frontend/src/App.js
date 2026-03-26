import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import InputNode from './components/InputNode';
import OutputNode from './components/OutputNode';
import './styles/App.css';

// Register custom node types
const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
};

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#7c3aed', strokeWidth: 2.5 },
  },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: '', type: '' });

  // Stable callback passed to InputNode so it never triggers re-render of nodes
  const handlePromptChange = useCallback((val) => {
    setPrompt(val);
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      type: 'inputNode',
      position: { x: 80, y: 180 },
      data: { onChange: handlePromptChange },
    },
    {
      id: '2',
      type: 'outputNode',
      position: { x: 580, y: 180 },
      data: { reply: '', loading: false },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Updates the output node's data field
  const updateOutputNode = useCallback((updates) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === '2' ? { ...node, data: { ...node.data, ...updates } } : node
      )
    );
  }, [setNodes]);

  const handleRunFlow = async () => {
    if (!prompt.trim()) {
      setStatus({ text: 'Please enter a prompt first.', type: 'error' });
      return;
    }

    setLoading(true);
    setReply('');
    setStatus({ text: '', type: '' });
    updateOutputNode({ reply: '', loading: true });

    try {
      console.log('📤 Calling /api/ask-ai with prompt:', prompt.slice(0, 80));
      const res = await axios.post('/api/ask-ai', { prompt });
      const aiReply = res.data.reply;
      console.log('📥 AI reply received');

      setReply(aiReply);
      updateOutputNode({ reply: aiReply, loading: false });
      setStatus({ text: 'Response received!', type: 'success' });
    } catch (error) {
      console.error('❌ Error calling AI:', error);
      const errMsg =
        error.response?.data?.error || 'Something went wrong. Try again.';
      setStatus({ text: `Error: ${errMsg}`, type: 'error' });
      updateOutputNode({ reply: '', loading: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt.trim() || !reply.trim()) {
      setStatus({ text: 'Nothing to save. Run the flow first.', type: 'error' });
      return;
    }

    try {
      console.log('💾 Saving to MongoDB...');
      await axios.post('/api/save', { prompt, response: reply });
      setStatus({ text: 'Saved to database!', type: 'success' });
      console.log('✅ Saved successfully');
    } catch (error) {
      console.error('❌ Error saving:', error);
      setStatus({ text: 'Failed to save. Try again.', type: 'error' });
    }
  };

  return (
    <div className="app-container">
      {/* ---- Header ---- */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">⚡</div>
          <div className="header-title-group">
            <h1>AI Flow App</h1>
            <span>Powered by Groq · LLaMA 3.1</span>
          </div>
        </div>

        <div className="header-right">
          <span className="header-model">llama-3.1-8b-instant</span>
          <span className="header-badge">Live</span>
        </div>
      </header>

      {/* ---- Toolbar ---- */}
      <div className="controls-bar">
        <button
          className="btn btn-run"
          onClick={handleRunFlow}
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={{ fontSize: '0.8rem' }}>⏳</span> Running…
            </>
          ) : (
            <>
              <span style={{ fontSize: '0.8rem' }}>▶</span> Run Flow
            </>
          )}
        </button>
        <button
          className="btn btn-save"
          onClick={handleSave}
          disabled={loading || !reply}
        >
          <span style={{ fontSize: '0.8rem' }}>💾</span> Save
        </button>
        {status.text && (
          <span className={`status-msg ${status.type}`}>{status.text}</span>
        )}

        <div className="toolbar-spacer" />
        <div className="toolbar-info">
          <span className="toolbar-dot" />
          Backend connected
        </div>
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
        >
          <Background color="#1a1a3e" gap={28} variant="dots" size={1.2} />
          <Controls />
          <MiniMap
            nodeColor={(node) =>
              node.type === 'inputNode' ? '#6c63ff' : '#28a745'
            }
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
