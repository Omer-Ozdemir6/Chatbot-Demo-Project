import { useState } from 'react';

import './App.css';
import { Chatbot } from './components/Chatbot';
import User from './components/User';
import { GoogleGenAI } from "@google/genai"

function App() {
  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [model, setModel] = useState(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY }); 
    return ai.models.getGenerativeModel({ model: "gemini-2.5-flash" });
  });

  


  async function handleChat(event) {
    event.preventDefault();
    const userMessage = userInput.trim();

    if (userMessage === '' || loading) return;
    const newUserMessage = { role: 'user', text: userMessage };
    setHistory(prev => [...prev, newUserMessage]);
    
    setUserInput('');
    setLoading(true);
    try {
      const result = await model.generateContent(userMessage); 
      const aiResponseText = result.response.text();
      const newAIResponse = { role: 'model', text: aiResponseText };
      setHistory(prev => [...prev, newAIResponse]);

    } catch (error) {
      console.error("Gemini API Hatası:", error);
      const errorMessage = { 
          role: 'model', 
          text: "Üzgünüm, API isteği sırasında bir hata oluştu." 
      };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }


  function handleChange(event) {
    const { value } = event.target;
    setUserInput(value);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-200">
      <div className=" bottom-[calc(4rem+1.5rem)] right-0 m-auto bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]">
        {/* Heaading */}
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
          <p className="text-sm text-[#6b7280] leading-3">Powered by Wit1225</p>
        </div>

        {/* Chat container */}
        <div
          className="pr-4 h-[474px]"
          style={{ minWidth: '100%', display: 'table' }}
        >
          <div className="max-h-[454px] overflow-auto">

          {history.map((msg, index) => 
                msg.role === 'user' ? (
                    <User key={index} text={msg.text} />
                ) : (
                    <Chatbot key={index} text={msg.text} /> 
                )
            )}
            {loading && <Chatbot text="Yapay zeka yanıt oluşturuyor..." />}
           
          </div>
        </div>
        {/*input box */}
        <div className="flex items-center pt-0">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleChat}>
            <input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="Message Gemini"
              value={userInput}
              onChange={handleChange}
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
              onClick={handleChat}
              type='submit'
              disabled={loading || userInput.trim() === ''}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

