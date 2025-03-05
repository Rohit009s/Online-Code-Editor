import React, { useState, useEffect } from 'react';
import { Code2, FileJson, Rss as Css3, Play, Download, Trash2, Sun, Moon } from 'lucide-react';

interface EditorState {
  html: string;
  css: string;
  javascript: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'output'>('html');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [code, setCode] = useState<EditorState>({
    html: '',
    css: '',
    javascript: ''
  });

  const updateCode = (type: keyof EditorState, value: string) => {
    setCode(prev => ({ ...prev, [type]: value }));
  };

  const generateOutput = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>${code.javascript}</script>
        </body>
      </html>
    `;
  };

  const downloadCode = () => {
    const blob = new Blob([generateOutput()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearCode = () => {
    setCode({ html: '', css: '', javascript: '' });
  };

  const tabs = [
    { id: 'html', label: 'HTML', icon: Code2 },
    { id: 'css', label: 'CSS', icon: Css3 },
    { id: 'js', label: 'JavaScript', icon: FileJson },
    { id: 'output', label: 'Output', icon: Play },
  ] as const;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Online Code Editor
          </h1>
          <div className="flex gap-4">
            <button
              onClick={downloadCode}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download size={18} /> Download
            </button>
            <button
              onClick={clearCode}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} /> Clear
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-500' : 'bg-gray-700 text-white'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-blue-500 text-white'
                      : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} hover:bg-blue-100`
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            <div className={activeTab !== 'output' ? 'block' : 'hidden'}>
              <textarea
                value={code[activeTab === 'js' ? 'javascript' : activeTab]}
                onChange={(e) => updateCode(activeTab === 'js' ? 'javascript' : activeTab, e.target.value)}
                className={`w-full h-[calc(100vh-250px)] p-4 font-mono text-sm rounded-lg ${
                  isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'
                }`}
                placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
              />
            </div>
          </div>

          <div className={`${activeTab === 'output' ? 'block' : 'hidden lg:block'}`}>
            <div className={`w-full h-[calc(100vh-250px)] rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <iframe
                srcDoc={generateOutput()}
                title="output"
                className="w-full h-full rounded-lg"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;