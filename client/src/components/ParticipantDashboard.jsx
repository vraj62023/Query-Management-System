import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";

const ParticipantDashboard = () => {
    const { user } = useContext(AuthContext);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: "", description: "" });

    const { title, description } = formData;

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const res = await axios.get("/api/queries/my");
                setQueries(res.data.queries);
                setLoading(false);
            } catch (err) {
                toast.error("Failed to load queries");
                setLoading(false);
            }
        };
        fetchQueries();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/queries", formData);
            setQueries([res.data.query, ...queries]);
            setFormData({ title: "", description: "" });
            toast.success("Ticket Created Successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error");
        }
    };

    const handleReopen = async (queryId) => {
        const reason = window.prompt("Write your reply:");
        if (!reason) return;

        try {
            await axios.patch("/api/queries/reopen", { queryId, reason });
            toast.info("Reply Sent!");
            const res = await axios.get("/api/queries/my");
            setQueries(res.data.queries);
        } catch (err) { toast.error("Failed to send reply"); }
    };

    // --- UNIVERSAL CHAT BUILDER ---
    const getChatThread = (q) => {
        // 1. Start with the Original Query (It counts as the first message)
        let thread = [{
            _id: 'original',
            sender: 'You',
            senderRole: 'USER', 
            message: q.description,
            date: q.createdAt
        }];

        // 2. Add History
        if (q.history && q.history.length > 0) {
            const historyMsgs = q.history.map((h, index) => ({
                _id: index,
                sender: h.sender,
                senderRole: h.senderRole, // Uses the new schema field
                message: h.message,
                date: h.date
            }));
            thread = [...thread, ...historyMsgs];
        } 
        // 3. Fallback for old tickets (Legacy Answer)
        else if (q.answer) {
            thread.push({
                _id: 'legacy',
                sender: 'Support Team',
                senderRole: 'ADMIN',
                message: q.answer,
                date: q.updatedAt
            });
        }
        
        return thread;
    };

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Support Dashboard</h1>
                    <p className="text-slate-500 mt-2">Welcome back, {user?.name}.</p>
                </div>

                {/* CREATE TICKET CARD */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-10">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-xl">✏️</span> Open a New Ticket
                    </h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Subject / Title"
                                value={title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            <textarea
                                placeholder="Describe your issue..."
                                value={description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows="3"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-md flex items-center gap-2">
                                🚀 Submit Ticket
                            </button>
                        </div>
                    </form>
                </div>

                {/* TICKET LIST */}
                <h3 className="text-xl font-bold text-slate-800 mb-6">Your Conversations</h3>

                {loading ? <div className="text-center py-10 text-slate-500">Loading...</div> : queries.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">No tickets yet.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                        {queries.map((q) => {
                            const chatThread = getChatThread(q);

                            return (
                                <div key={q._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                                    
                                    {/* HEADER */}
                                    <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    q.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                                    q.status === 'ESCALATED' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {q.status}
                                                </span>
                                                <span className="text-xs text-slate-400">#{q._id.slice(-4)}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-lg">{q.title}</h4>
                                        </div>
                                    </div>

                                    {/* CHAT AREA */}
                                    <div className="p-6 bg-[#efeae2] space-y-4 flex-grow max-h-[500px] overflow-y-auto">
                                        {chatThread.map((msg, index) => {
                                            // LOGIC: If I am USER, and msg is USER -> Right Side
                                            const isMe = msg.senderRole === 'USER';

                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div 
                                                        className={`relative p-3 rounded-lg shadow-sm max-w-[85%] text-sm ${
                                                            isMe 
                                                            ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' // User Green
                                                            : 'bg-white text-slate-900 rounded-tl-none'     // Support White
                                                        }`}
                                                    >
                                                        {!isMe && (
                                                            <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">
                                                                {msg.sender}
                                                            </p>
                                                        )}
                                                        
                                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                                        
                                                        <div className="mt-1 flex justify-end items-center gap-1 opacity-60">
                                                            <span className="text-[10px]">
                                                                {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                            {isMe && <span>✓✓</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* REPLY FOOTER */}
                                    {q.status === 'RESOLVED' && (
                                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-3">
                                            <span className="text-xs text-slate-400">Issue still persists?</span>
                                            <button 
                                                onClick={() => handleReopen(q._id)}
                                                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
                                            >
                                                <span>↩️</span> Reply / Re-open
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantDashboard;