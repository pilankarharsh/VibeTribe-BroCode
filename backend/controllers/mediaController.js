export const uploadMedia = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Invalid file type.' });
  // For demo purposes, return local file path. In production, upload to cloud storage.
  const media_url = `/uploads/${req.file.filename}`;
  return res.status(201).json({ media_url });
};


