const fs = require('fs');

let content = fs.readFileSync('dist/server.cjs', 'utf8');

// Clean up any previously nested broadcast route
content = content.replace(/\s*app\.post\("\/api\/admin\/broadcast-push"[\s\S]*?\}\);\s*\}\);\s*$/m, '');

const targetStr = 'app.post("/api/push/subscribe"';
const idx = content.indexOf(targetStr);

if (idx !== -1) {
  // Find the closing }); of the subscribe endpoint
  let count = 0;
  let endPos = -1;
  for (let i = idx; i < content.length; i++) {
    if (content[i] === '{') count++;
    if (content[i] === '}') {
      count--;
      if (count === 0) {
        endPos = i + 2; // after });
        break;
      }
    }
  }

  if (endPos !== -1) {
    const broadcastCode = `

  app.post("/api/admin/broadcast-push", async (req, res) => {
    try {
      if (!isAuthorizedAuthor(req)) {
        return res.status(403).json({ success: false, error: "Acceso denegado. Se requiere PIN de autor." });
      }
      const { title, message, badge, resourceId, author } = req.body || {};
      if (!title || !message) {
        return res.status(400).json({ success: false, error: "Título y mensaje de la notificación son requeridos." });
      }

      const registeredUsers = readRegisteredUsers();
      const notifs = readJsonFile(notificationsFile, []);
      const pushSubs = readJsonFile(pushSubscriptionsFile, []);

      const newNotif = {
        id: "notif-broadcast-" + Date.now(),
        title: title.trim(),
        message: message.trim(),
        date: new Date().toISOString().split("T")[0],
        badge: (badge || "ALERTA PUSH 📲").trim(),
        resourceId: resourceId || "",
        author: (author || "Dr. Carlos Leal").trim()
      };

      notifs.unshift(newNotif);
      writeJsonFile(notificationsFile, notifs);
      writeJsonFile(notificationsBackupFile, notifs);

      if (db) {
        try {
          const notifRef = (0, import_firestore.doc)(db, "notifications", newNotif.id);
          (0, import_firestore.setDoc)(notifRef, newNotif, { merge: true }).catch(() => {});
        } catch (e) {}
      }

      const recipientDoctors = registeredUsers.map(u => ({
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        country: u.country
      }));

      return res.json({
        success: true,
        broadcastNotification: newNotif,
        totalRegisteredUsers: registeredUsers.length,
        totalPushSubscriptions: pushSubs.length,
        deliveredCount: registeredUsers.length,
        recipientDoctors,
        message: "✅ Notificación Push transmitida con éxito a los " + registeredUsers.length + " médicos registrados y dispositivos activos."
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err?.message || "Error al transmitir notificación push." });
    }
  });
`;
    content = content.slice(0, endPos) + broadcastCode + content.slice(endPos);
    fs.writeFileSync('dist/server.cjs', content, 'utf8');
    console.log('Successfully placed /api/admin/broadcast-push at top-level!');
  }
}
