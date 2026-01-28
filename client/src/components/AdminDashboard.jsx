import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
    const [view, setView] = useState("QUERIES"); // 'QUERIES' or 'USERS'
    
    // Data States
    const [queries, setQueries] = useState([]);
    const [users, setUsers] = useState([]); // Heads & Participants
    const [heads, setHeads] = useState([]); // Just for assignment dropdown
    
    // Filters & UI States
    const [filter, setFilter] = useState("ALL");
    const [selectedHeads, setSelectedHeads] = useState({});

    // --- FETCH DATA ---
    const fetchData = async () => {
        try {
            const qRes = await axios.get("/api/queries/all");
            setQueries(qRes.data);
            
            const hRes = await axios.get("/api/auth/heads");
            setHeads(hRes.data);

            const uRes = await axios.get("/api/admin/users");
            setUsers(uRes.data);
        } catch (err) { toast.error("Failed to load data"); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- QUERY ACTIONS ---
    const handleAssign = async (queryId) => {
        const headId = selectedHeads[queryId];
        if (!headId) return toast.error("Select a Head first");
        try {
            await axios.patch("/api/queries/assign", { queryId, headId });
            toast.success("Assigned!");
            fetchData();
        } catch (err) { toast.error("Failed"); }
    };

    const handleAdminResolve = async (queryId) => {
        const answer = prompt("Enter solution directly:");
        if (!answer) return;
        try {
            await axios.patch("/api/queries/resolve", { queryId, answer });
            toast.success("Resolved!");
            fetchData();
        } catch (err) { toast.error("Error resolving"); }
    };

    // --- USER ACTIONS ---
    const handleBlockToggle = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'Unblock' : 'Block'} this user?`)) return;
        try {
            await axios.patch("/api/admin/block", { userId });
            toast.success(`User ${currentStatus ? 'Unblocked' : 'Blocked'}`);
            fetchData(); // Refresh list
        } catch (err) { toast.error("Failed to update status"); }
    };

    // --- HELPERS ---
    const getChatThread = (q) => {
        let thread = [{ _id: 'orig', sender: q.submittedBy?.name||'User', senderRole:'USER', message: q.description, date: q.createdAt }];
        if(q.history?.length > 0) {
            thread = [...thread, ...q.history.map((h,i)=>({ ...h, senderRole: h.senderRole||(h.action==='REOPENED'?'USER':'ADMIN') }))];
        } else if(q.answer) {
            thread.push({ _id:'leg', sender:'Support', senderRole:'ADMIN', message:q.answer, date:q.updatedAt });
        }
        return thread;
    };

    const getInitials = (n) => n ? n.substring(0,2).toUpperCase() : "??";

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
                {/* HEADER & TABS */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-slate-900">Admin Control Center</h2>
                    <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
                        <button 
                            onClick={() => setView("QUERIES")}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${view === "QUERIES" ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                            Manage Queries
                        </button>
                        <button 
                            onClick={() => setView("USERS")}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${view === "USERS" ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                            Manage Users
                        </button>
                    </div>
                </div>

                {/* === VIEW: QUERIES === */}
                {view === "QUERIES" && (
                    <div className="space-y-8">
                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {["ALL", "PENDING", "ACTIVE", "ESCALATED", "RESOLVED"].map(s => (
                                <button key={s} onClick={()=>setFilter(s)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter===s?"bg-slate-800 text-white":"bg-white text-slate-600 hover:bg-slate-200"}`}>{s}</button>
                            ))}
                        </div>

                        {queries.filter(q => filter === "ALL" || (filter === "PENDING" && q.status === "UNASSIGNED") || (filter === "ACTIVE" && q.status === "ASSIGNED") || q.status === filter).map(q => {
                            const thread = getChatThread(q);
                            return (
                                <div key={q._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    {/* ... (Existing Query Header Code) ... */}
                                    <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">{getInitials(q.submittedBy?.name)}</div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{q.submittedBy?.name}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.status==='RESOLVED'?'bg-green-100 text-green-700':q.status==='ESCALATED'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{q.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400">Created: {new Date(q.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="p-4 bg-[#efeae2] space-y-3 max-h-[400px] overflow-y-auto">
                                        {thread.map((msg, i) => {
                                            const isMe = msg.senderRole !== 'USER';
                                            return (
                                                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`p-3 rounded-lg shadow-sm max-w-[80%] text-sm ${isMe ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                                                        <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">{msg.sender}</p>
                                                        <p className="whitespace-pre-wrap">{msg.message}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Actions */}
                                    {q.status !== 'RESOLVED' && (
                                        <div className="p-3 bg-white border-t flex gap-2 justify-end">
                                            <select className="p-2 border rounded text-sm" onChange={(e)=>setSelectedHeads({...selectedHeads, [q._id]: e.target.value})}>
                                                <option value="">Assign Head</option>
                                                {heads.map(h=><option key={h._id} value={h._id}>{h.name}</option>)}
                                            </select>
                                            <button onClick={()=>handleAssign(q._id)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-bold text-xs">Assign</button>
                                            <button onClick={()=>handleAdminResolve(q._id)} className="px-3 py-1 bg-green-600 text-white rounded font-bold text-xs">Resolve</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* === VIEW: USER MANAGEMENT === */}
                {view === "USERS" && (
                    <div className="grid md:grid-cols-2 gap-8">
                        
                        {/* LIST 1: HEADS */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800">Department Heads</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {users.filter(u => u.role === 'HEAD').map(user => (
                                    <div key={user._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Active: {user.stats?.active || 0}</span>
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded">Solved: {user.stats?.resolved || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Block Button */}
                                        <button 
                                            onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                                user.isBlocked 
                                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                            }`}
                                        >
                                            {user.isBlocked ? "Unblock" : "Block"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LIST 2: PARTICIPANTS */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800">Participants</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {users.filter(u => u.role === 'USER').map(user => (
                                    <div key={user._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${user.isBlocked ? 'text-red-500 line-through' : 'text-slate-900'}`}>{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Total Tickets: {user.stats?.totalQueries || 0}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                                user.isBlocked 
                                                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                            }`}
                                        >
                                            {user.isBlocked ? "Unblock" : "Block"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;