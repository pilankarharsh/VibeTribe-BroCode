import InviteCode from '../models/InviteCode.js';
import crypto from 'crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid ambiguous chars
function generateShortCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const idx = crypto.randomInt(0, ALPHABET.length);
    code += ALPHABET[idx];
  }
  return code;
}

export const generateInviteCode = async (req, res) => {
  const { intended_for } = req.body || {};
  try {
    let attempts = 0;
    while (attempts < 5) {
      const code = generateShortCode(6);
      try {
        const invite = await InviteCode.create({
          code,
          generatedBy: req.userId || null,
          intendedFor: intended_for || null
        });
        return res.status(201).json(invite);
      } catch (err) {
        // E11000 duplicate key error → retry with a new code
        const message = String(err && err.message || '');
        if (message.includes('E11000') && message.includes('code_1')) {
          attempts += 1;
          continue;
        }
        throw err;
      }
    }
    return res.status(500).json({ error: 'Could not generate a unique invite code. Please try again.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const listInviteCodes = async (req, res) => {
  try {
    const invites = await InviteCode.find({ generatedBy: req.userId }).sort({ created_at: -1 });
    return res.status(200).json(invites);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const revokeInviteCode = async (req, res) => {
  try {
    const { code } = req.params;
    const invite = await InviteCode.findOne({ code, generatedBy: req.userId });
    if (!invite) return res.status(404).json({ error: 'Invite code not found.' });
    if (invite.isUsed) return res.status(400).json({ error: 'Invite code already used.' });
    await InviteCode.deleteOne({ _id: invite._id });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


