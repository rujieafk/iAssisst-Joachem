const { app, upload } = require('./server.js');

app.post('/UpdateRequest', upload.fields([
  { name: 'updatethisLabel' },
  { name: 'updatethisLink' }
]), async (req, res) => {
  try {
    const { updatethisLabel, updatethisLink } = req.body;

    // await dbOperation.UpdateLink(updatethisLink, updatethisLabel);
    console.log(updatethisLabel, updatethisLink);

    res.status(200).json({ message: 'Link updated successfully' });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
