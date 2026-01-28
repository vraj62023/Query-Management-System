const Query = require('../models/Query');

// create a new query 
exports.createQuery = async (req,res)=>{
    try{
        const {title, description} = req.body;

        const newQuery = new Query({
            title,
            description,
            submittedBy: req.user.id // We get this from our 'protect' middleware!
        });
        await newQuery.save();
        res.status(201).json({message:"Query created successfully", query:newQuery});

    }catch(err){
        res.status(500).json({message:"Server error", error: err.message});
    }
};

// get all queries for the logged - in user
exports.getUserQueries = async (req,res)=>{
    try{
        const queries = await Query.find({submittedBy: req.user.id});
        res.status(200).json({queries});
    }catch(err){        
        res.status(500).json({message:"Server error", error: err.message});
    }
};
// Function for Admins to assign a query to a Team Head
exports.assignQuery = async (req, res) => {
    try {
        const { queryId, headId } = req.body;

        // Smart Logic:
        // If headId is present -> Assign it to that person.
        // If headId is null/empty -> Unassign it (Reset).
        let updateData;

        if (headId) {
            updateData = {
                assignedTo: headId,
                status: 'ASSIGNED'
            };
        } else {
            // UNASSIGN LOGIC
            updateData = {
                assignedTo: null,
                status: 'UNASSIGNED'
            };
        }

        const query = await Query.findByIdAndUpdate(
            queryId, 
            updateData, 
            { new: true } // Return the updated document
        ).populate('submittedBy', 'name email')
         .populate('assignedTo', 'name email');

        if (!query) {
            return res.status(404).json({ message: "Query not found" });
        }

        res.status(200).json(query);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// Function for Team Heads to answer a query
// exports.resolveQuery = async (req, res) => {
//     try {
//         const { queryId, answer } = req.body;

//         // 1. Find the query
//         const query = await Query.findById(queryId);

//         if (!query) return res.status(404).json({ message: "Query not found" });

//         // 2. Expert Security Check: Is this Head actually the one assigned?
//         // query.assignedTo is an ObjectID, so we convert it to string to compare
//         if (query.assignedTo.toString() !== req.user.id) {
//             return res.status(403).json({ message: "You are not assigned to this query!" });
//         }

//         // 3. Update status and save answer
//         query.status = 'RESOLVED';
//         query.answer = answer;

//         await query.save();

//         res.status(200).json({ message: "Query resolved successfully", query });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };
// Get ALL queries (Admin only)
exports.getAllQueries = async (req, res) => {
    try {
        // .populate('submittedBy') is the MAGIC. 
        // It replaces the ID "64b..." with the actual object { name: "Vipin", email:... }
        // This lets the Admin see WHO asked the question.
        const queries = await Query.find()
            .populate('submittedBy', 'name email') 
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json(queries);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 1. Get queries assigned to the specific Department Head
exports.getAssignedQueries = async (req, res) => {
    try {
        const queries = await Query.find({ assignedTo: req.user.id })
            .populate('submittedBy', 'name email') // See who asked it
            .sort({ createdAt: -1 });

        res.status(200).json(queries);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. Mark as Resolved and provide the Answer
exports.resolveQuery = async (req, res) => {
    try {
        const { queryId, answer } = req.body;

        const query = await Query.findById(queryId);

        if (!query) return res.status(404).json({ message: "Query not found" });

       // Allow if User is Head (assigned) OR if User is Admin
        if (req.user.role !== 'ADMIN' && query.assignedTo?.toString() !== req.user.id) {
             return res.status(403).json({ message: "Not authorized" });
        }

        query.status = 'RESOLVED';
        query.history.push({
            sender: req.user.name,
            senderRole: req.user.role, // Saves "ADMIN" or "HEAD"
            message: answer,
            action: 'RESOLVED'
        });
        await query.save();
        query.answer = answer;
        res.status(200).json(query);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
// A. Head sends it back to Admin
exports.escalateQuery = async (req, res) => {
    try {
        const { queryId, reason } = req.body;
        // Set status to ESCALATED and remove the assigned Head
        const query = await Query.findByIdAndUpdate(queryId, {
            status: 'ESCALATED',
            assignedTo: null,
            // Optional: Append reason to description so Admin knows why
            $push: { history: `Escalated by Head: ${reason}` } 
        }, { new: true });

        res.status(200).json(query);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// B. Participant re-opens a closed ticket
exports.reopenQuery = async (req, res) => {
    try {
        const { queryId, reason } = req.body; // Ideally, user sends a reason
        const query = await Query.findOne({ _id: queryId, submittedBy: req.user.id });
        
        if (!query) return res.status(404).json({ message: "Query not found" });

        query.status = 'UNASSIGNED';
        query.assignedTo = null; 

        // PUSH TO HISTORY
       query.history.push({
            sender: req.user.name,
            senderRole: 'USER',
            message: reason,
            action: 'REOPENED'
        });

        await query.save();
        res.status(200).json(query);
    } catch (error) { res.status(500).json({ message: "Server Error" }); }
};
