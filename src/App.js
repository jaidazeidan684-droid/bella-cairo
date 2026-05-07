import React, { useState } from 'react';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to Bella Cairo! 🌙 How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are Layla, a warm and elegant assistant for Bella Cairo, 
              a fine dining Egyptian restaurant in Zamalek, Cairo. 
              Help customers with menu questions, reservations, hours, and location.
              Opening hours: Daily 12pm-11pm.
              Location: 15 Hassan Sabri St, Zamalek, Cairo.
              Reservations: +20 100 000 0000.
              Keep replies short, friendly and professional.`
            },
            ...updatedMessages.filter(m => 
              m.role === 'user' || 
              (m.role === 'assistant' && m.content !== 'Welcome to Bella Cairo! 🌙 How can I help you today?')
            )
          ],
          max_tokens: 200
        })
      });

      const data = await response.json();
      console.log('Groq response:', data);

      if (data.choices && data.choices[0]) {
        const aiMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting. Please call us at +20 100 000 0000.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white font-serif">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-yellow-800">
        <h1 className="text-yellow-400 text-3xl font-bold tracking-widest">BELLA CAIRO</h1>
        <div className="flex gap-8 text-yellow-200 text-sm tracking-wider">
          <a href="#menu" className="hover:text-yellow-400 transition">MENU</a>
          <a href="#about" className="hover:text-yellow-400 transition">ABOUT</a>
          <a href="#contact" className="hover:text-yellow-400 transition">CONTACT</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative flex flex-col items-center justify-center text-center py-40 px-6"
        style={{ background: 'linear-gradient(to bottom, #1c0a00, #3d1a00)' }}>
        <p className="text-yellow-500 tracking-[0.4em] text-sm mb-4">EST. 2024 · ZAMALEK, CAIRO</p>
        <h2 className="text-6xl font-bold text-yellow-100 mb-6 leading-tight">
          A Taste of Egypt,<br />Elevated.
        </h2>
        <p className="text-yellow-300 text-lg max-w-xl mb-10">
          Experience the finest Egyptian cuisine in an atmosphere of timeless elegance. 
          Every dish tells a story of tradition and passion.
        </p>
        <div className="flex gap-4">
          <a href="#menu"
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 tracking-widest text-sm transition">
            VIEW MENU
          </a>
          <a href="#contact"
            className="border border-yellow-600 hover:bg-yellow-900 text-yellow-300 px-8 py-3 tracking-widest text-sm transition">
            RESERVE A TABLE
          </a>
        </div>
      </div>

      {/* MENU SECTION */}
      <div id="menu" className="py-24 px-10 bg-stone-900">
        <p className="text-yellow-500 tracking-[0.4em] text-sm text-center mb-2">OUR SPECIALTIES</p>
        <h3 className="text-4xl text-yellow-100 text-center mb-16">The Menu</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Koshary Royal', price: 'EGP 85', desc: "Our elevated take on Egypt's beloved street dish with truffle oil and crispy shallots." },
            { name: 'Hamam Mashwi', price: 'EGP 220', desc: 'Slow-roasted pigeon stuffed with freekeh, pomegranate, and fresh herbs.' },
            { name: 'Umm Ali Soufflé', price: 'EGP 95', desc: 'A modern twist on the classic Egyptian dessert, served warm with ashta cream.' },
            { name: 'Sayyadiah', price: 'EGP 185', desc: 'Alexandrian spiced fish over saffron rice with caramelized onions.' },
            { name: 'Feteer Platter', price: 'EGP 120', desc: 'Flaky Egyptian pastry served with honey, cheese, and seasonal preserves.' },
            { name: 'Hibiscus Sorbet', price: 'EGP 65', desc: 'House-made karkadeh sorbet with rose water and crushed pistachios.' },
          ].map((item, i) => (
            <div key={i} className="border border-yellow-900 p-6 hover:border-yellow-600 transition">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-yellow-200 text-lg">{item.name}</h4>
                <span className="text-yellow-500 text-sm">{item.price}</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div id="about" className="py-24 px-10 text-center"
        style={{ background: 'linear-gradient(to bottom, #1c0a00, #0f0500)' }}>
        <p className="text-yellow-500 tracking-[0.4em] text-sm mb-2">OUR STORY</p>
        <h3 className="text-4xl text-yellow-100 mb-8">Where Cairo Meets Fine Dining</h3>
        <p className="text-stone-400 max-w-2xl mx-auto leading-relaxed">
          Nestled in the heart of Zamalek, Bella Cairo was born from a passion for 
          Egyptian heritage and world-class hospitality. Our chefs blend centuries-old 
          recipes with modern techniques to create an unforgettable dining experience.
        </p>
      </div>

      {/* CONTACT SECTION */}
      <div id="contact" className="py-24 px-10 bg-stone-900 text-center">
        <p className="text-yellow-500 tracking-[0.4em] text-sm mb-2">FIND US</p>
        <h3 className="text-4xl text-yellow-100 mb-10">Visit Bella Cairo</h3>
        <div className="flex justify-center gap-24 text-stone-400">
          <div>
            <p className="text-yellow-400 text-sm tracking-widest mb-2">LOCATION</p>
            <p>15 Hassan Sabri St.</p>
            <p>Zamalek, Cairo</p>
          </div>
          <div>
            <p className="text-yellow-400 text-sm tracking-widest mb-2">HOURS</p>
            <p>Daily</p>
            <p>12:00 PM – 11:00 PM</p>
          </div>
          <div>
            <p className="text-yellow-400 text-sm tracking-widest mb-2">RESERVATIONS</p>
            <p>+20 100 000 0000</p>
            <p>info@bellacairo.com</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-6 text-center text-stone-600 text-xs border-t border-stone-800">
        © 2024 Bella Cairo · Built by Jaida Zeidan
      </div>

      {/* CHAT BUTTON */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-yellow-600 hover:bg-yellow-500 text-white w-14 h-14 rounded-full text-2xl shadow-lg transition z-50">
        {chatOpen ? '✕' : '💬'}
      </button>

      {/* CHAT WINDOW */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-stone-900 border border-yellow-800 rounded-lg shadow-2xl z-50 flex flex-col" style={{ height: '400px' }}>
          <div className="bg-yellow-800 px-4 py-3 rounded-t-lg">
            <p className="text-yellow-100 font-bold text-sm">Bella Cairo Assistant</p>
            <p className="text-yellow-300 text-xs">We typically reply instantly</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-lg max-w-xs ${
                msg.role === 'assistant'
                  ? 'bg-stone-700 text-stone-200 self-start'
                  : 'bg-yellow-700 text-white self-end'
              }`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="text-sm px-3 py-2 rounded-lg max-w-xs bg-stone-700 text-stone-400 self-start italic">
                Layla is typing...
              </div>
            )}
          </div>
          <div className="p-3 border-t border-stone-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask us anything..."
              className="flex-1 bg-stone-800 text-white text-sm px-3 py-2 rounded outline-none border border-stone-600 focus:border-yellow-600"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white px-3 py-2 rounded text-sm transition">
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;