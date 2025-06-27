

```js
const express = require('express');
const app = express();
const { makeWaSocket } = require('@whiskeysockets/baileys');
const { useSingleFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');

app.use(express.json());
app.use(express.static('public'));

app.post('/pair', async (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).send('No number provided');

  const { state, saveState } = useSingleFileAuthState(`./sessions/${number}.json`);
  const sock = makeWaSocket({ auth: state });

  sock.ev.on('connection.update', (update) => {
    const { qr } = update;
    if (qr) {
      res.send({ qr }); // Send QR to frontend
    }
  });

  sock.ev.on('creds.update', saveState);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

---
