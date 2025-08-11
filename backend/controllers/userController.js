import InviteCode from "../models/InviteCode.js";
import User from "../models/User.js";
import WaitlistUser from "../models/WaitlistUser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
    try{
        const {username, email, password, inviteCode} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        // If invite code provided, validate; else we treat as waitlist join
        let isCodeValid = null;
        if (inviteCode) {
            isCodeValid = await InviteCode.findOne({code: inviteCode, isUsed: false});
            if(!isCodeValid)
                return res.status(401).json({ error: "Invalid or missing invite code." });
        }
        //Check if email already exist
        const isExistingUser = await User.findOne({ email });
        if (isExistingUser)
            return res.status(400).json({ error: "Email already exists." });

        //Check if username already exist
        const isExistingUsername = await User.findOne({ username });
        if (isExistingUsername)
            return res.status(400).json({ error: "Username already exists." });               


        //Encrypt Password
        const hashPassword = await bcrypt.hash(password, 10)
        // If no invite code, add to waitlist and return 202
        if (!inviteCode) {
            try { await WaitlistUser.updateOne({ email }, { $set: { email, username } }, { upsert: true }); } catch (_) {}
            return res.status(202).json({ message: 'Added to waitlist.' });
        }

        //Save details on Database
        const user = await User.create({ username, email, password: hashPassword });
        if (isCodeValid) {
            isCodeValid.isUsed = true;
            await isCodeValid.save();
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "60d" });

        // Remove from waitlist if present
        try { await WaitlistUser.findOneAndDelete({ email }); } catch (_) {}

        return res.status(201).json({ token });
    }catch(error) {
        res.status(500).json({ error: error.message });
    }
};

const checkUser = async (req, res) =>{
    const {identifier, password} = req.body;

    if(!identifier|| !password){
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    try{
        const user = await User.findOne(
            identifier.includes('@') ? {email: identifier} : {username: identifier}
        );
        if(!user){
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
            return res.status(401).json({ error: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "60d" });
        return res.status(200).json({ token });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};
const resetPassword = async (req, res) => {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Invalid input.' });
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Email not found.' });
        // Real implementation would send email here
        return res.status(200).json({ message: 'Reset link sent.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export {createUser, checkUser, resetPassword};