import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const HeadDashboard = () => {
    const [queries, setQueries] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchAssigned = async () => {
            try {
                const res = await axios.get("/api/queries/assigned");
                setQueries(res.data);
            } catch (err) {
                toast.error("Failed to load assignments");
            }
        };
        fetchAssigned();
    }, []);

    const handleResolve = async (queryId) => {
        const answerText = answers[queryId];
        if (!answerText) return toast.error("Please write an answer first");

        try {
            await axios.patch("/api/queries/resolve", { queryId, answer: answerText });
            toast.success("Query Resolved!");
            const res = await axios.get("/api/queries/assigned");
            setQueries(res.data);
        } catch (err) {
            toast.error("Failed to resolve");
        }
    };

    const handleEscalate = async (queryId) => {
        const reason = prompt("Reason for escalation:");
        if (!reason) return;

        try {
            await axios.patch("/api/queries/escalate", { queryId, reason });
            toast.info("Returned to Admin");
            const res = await axios.get("/api/queries/assigned");
            setQueries(res.data);
        } catch (err) { toast.error("Failed to escalate"); }
    };

    // --- UNIVERSAL CHAT BUILDER ---
    const getChatThread = (q) => {
        let thread = [{
            _id: 'original',
            sender: q.submittedBy?.name || 'User',
            senderRole: 'USER',
            message: q.description,
            date: q.createdAt
        }];

        if (q.history && q.history.length > 0) {
            const historyMsgs = q.history.map((h, index) => ({
                _id: index,
                sender: h.sender,
                senderRole: h.senderRole || (h.action === 'REOPENED' ? 'USER' : 'HEAD'),
                message: h.message,
                date: h.date
            }));
            thread = [...thread, ...historyMsgs];
        } else if (q.answer) {
            thread.push({
                _id: 'legacy',
                sender: 'Support Team',
                senderRole: 'HEAD',
                message: q.answer,
                date: q.updatedAt
            });
        }
        return thread;
    };

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "??";

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">My Workload</h2>
                    <p className="text-slate-500">You have {queries.filter(q => q.status !== 'RESOLVED').length} pending tasks.</p>
                </div>

                {queries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <p className="text-xl text-slate-400 font-bold">🎉 All caught up!</p>
                        <p className="text-slate-400">No pending queries assigned to you.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {queries.map((q) => {
                            const chatThread = getChatThread(q);

                            return (
                                <div key={q._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                                    {/* HEADER */}
                                    <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                {getInitials(q.submittedBy?.name)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{q.submittedBy?.name}</h3>
                                                <p className="text-sm text-slate-500">{q.submittedBy?.email}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                                                        q.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {q.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CHAT AREA */}
                                    <div className="p-6 bg-[#efeae2] space-y-4 max-h-[500px] overflow-y-auto">
                                        {chatThread.map((msg, idx) => {
                                            // HEAD VIEW: "Me" is Admin/Head
                                            const isMe = msg.senderRole !== 'USER';

                                            return (
                                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`relative p-3 rounded-lg shadow-sm max-w-[80%] text-sm ${
                                                        isMe 
                                                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' // Head (Green/Right)
                                                        : 'bg-white text-slate-900 rounded-tl-none'     // User (White/Left)
                                                    }`}>
                                                        <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">
                                                            {msg.sender}
                                                        </p>
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

                                    {/* ACTION AREA */}
                                    {q.status !== 'RESOLVED' ? (
                                        <div className="p-4 bg-white border-t border-slate-100">
                                            <textarea 
                                                placeholder="Type your solution here..."
                                                rows="3"
                                                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                                onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })}
                                            />
                                            <div className="flex justify-between items-center mt-3">
                                                <button 
                                                    onClick={() => handleEscalate(q._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-bold hover:underline"
                                                >
                                                    ⚠️ Escalate
                                                </button>
                                                <button 
                                                    onClick={() => handleResolve(q._id)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all"
                                                >
                                                    Submit Solution
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-green-50 text-green-800 text-center font-bold text-sm border-t border-green-100">
                                            ✅ Ticket Resolved.
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

export default HeadDashboard;