"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api"; // Importat cu acolade conform erorii
import { Send, User as UserIcon, Activity, ShieldAlert } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Interfețe pentru a repara erorile de tip 'never'
interface Message {
  id: number;
  content: string;
  senderRole: string;
  createdAt: string;
}

interface Contact {
  id: number;
  name: string;
  role: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await api.get("/users/me");
        setCurrentUser(userRes.data);
        
        // Rută diferită în funcție de cine ești
        const route = userRes.data.role === 'NUTRITIONIST' ? "/nutrition/all-patients" : "/users/nutritionists";
        const res = await api.get(route);
        
        const mapped = res.data.map((item: any) => ({
          id: item.user?.id || item.id,
          name: item.user?.name || item.name || "Utilizator",
          role: item.role || "USER"
        }));
        setContacts(mapped);
      } catch (err) { console.error(err); }
    };
    init();
  }, []);

  const loadConversation = async (contact: Contact) => {
    setActiveContact(contact);
    try {
      const chatRes = await api.get(`/chat/history/${contact.id}`);
      setMessages(chatRes.data);

      if (currentUser?.role === 'NUTRITIONIST') {
        const [report, prefs] = await Promise.all([
          api.get(`/nutrition/report/${contact.id}`),
          api.get(`/preferences/${contact.id}`)
        ]);
        setPatientData({ ...report.data, preferences: prefs.data });
      }
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;
    try {
      const res = await api.post("/chat/send", { receiverId: activeContact.id, content: newMessage });
      setMessages(prev => [...prev, res.data]);
      setNewMessage("");
    } catch (err) { console.error(err); }
  };

  // UI PENTRU CLIENT (Simple Chat)
  if (currentUser?.role === 'USER') {
    return (
      <div className="flex h-[calc(100vh-80px)] bg-white">
        <div className="w-64 border-r bg-gray-50 p-4">
          <h2 className="text-xs font-black text-gray-400 mb-4 uppercase">Specialiști</h2>
          {contacts.map(c => (
            <div key={c.id} onClick={() => loadConversation(c)} 
              className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 ${activeContact?.id === c.id ? "bg-green-600 text-white" : "hover:bg-gray-200"}`}>
              <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                {c.name ? c.name[0] : "U"} {/* Fix crash reading 0 */}
              </div>
              <span className="text-sm font-bold">{c.name}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col">
          {activeContact ? (
            <>
              <div className="p-4 border-b font-bold">{activeContact.name}</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.senderRole === 'USER' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[70%] ${m.senderRole === 'USER' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 border rounded-full px-4 py-2" placeholder="Scrie mesaj..." />
                <button type="submit" className="bg-green-600 text-white p-2 rounded-full"><Send size={20}/></button>
              </form>
            </>
          ) : <div className="flex-1 flex items-center justify-center text-gray-400 font-bold italic">Selectează un nutriționist</div>}
        </div>
      </div>
    );
  }

  // UI PENTRU NUTRITIONIST (Triplă coloană)
  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      <div className="w-64 border-r bg-gray-50">
        <div className="p-4 text-xs font-black text-gray-400 uppercase">Clienții Mei</div>
        {contacts.map(c => (
          <div key={c.id} onClick={() => loadConversation(c)} className={`p-4 cursor-pointer flex items-center gap-3 ${activeContact?.id === c.id ? "bg-green-600 text-white" : "hover:bg-gray-100"}`}>
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
              {c.name ? c.name[0] : "U"}
            </div>
            <span className="font-bold text-sm">{c.name}</span>
          </div>
        ))}
      </div>
      <div className="w-[400px] border-r flex flex-col">
        {activeContact && (
          <>
            <div className="p-4 border-b font-black italic">{activeContact.name}</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.senderRole === 'NUTRITIONIST' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 px-4 rounded-2xl text-sm ${m.senderRole === 'NUTRITIONIST' ? 'bg-green-600 text-white' : 'bg-white border shadow-sm'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm" placeholder="Răspunde..." />
              <button className="bg-green-600 text-white p-2 rounded-xl"><Send size={18}/></button>
            </form>
          </>
        )}
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {patientData ? (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 font-black uppercase"><Activity className="text-green-600"/> Analiză Client</h2>
            <div className="h-48 bg-gray-50 rounded-3xl p-4 border">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patientData.weightHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" /> <YAxis /> <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-[10px] font-bold text-green-600 uppercase">Target Calorii</p>
                <p className="text-xl font-black">{patientData.profile?.targetCalories || 0} kcal</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <h4 className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1"><ShieldAlert size={12}/> Alergii</h4>
                <p className="text-xs font-bold">{patientData.preferences?.allergies || "NICIO ALERGIE"}</p>
              </div>
            </div>
          </div>
        ) : <div className="h-full flex items-center justify-center text-gray-300">Selectează un client</div>}
      </div>
    </div>
  );
}