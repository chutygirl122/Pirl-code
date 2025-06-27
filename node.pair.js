

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
  if (!number) return res.status(400).send('+94766359869');

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
✅ 3. Frontend (public/index.html)

```html
<!DOCTYPE html>
<html>
<head><title>PASIYA-MD Pair</title></head>
<body>
  <h2>Enter WhatsApp Number:</h2>
  <input type="text" id="number">
  <button onclick="getQR()">Generate QR</button>
  <br><br>
  <img id="qrImg" />

<script>
function getQR() {
  const number = document.getElementById('number').value;
  fetch('/pair', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('qrImg').src = 'https://api.qrserver.com/v1/create-qr-code/?data=' + data.qr;
  });
}
</script>
</body>
</html>
```

---

🔄 දැන්
3. Number එක දාල QR එක generate කරන්න  
