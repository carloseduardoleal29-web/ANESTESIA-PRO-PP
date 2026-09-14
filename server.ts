import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON and urlencoded with large limits for image uploads (base64)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Serve /uploads directory statically both in dev and prod
  const publicDir = path.join(process.cwd(), "public");
  const uploadsDir = path.join(publicDir, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // Helper to read/write JSON files safely
  const readJsonFile = <T>(filePath: string, fallback: T): T => {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw) as T;
      }
    } catch (e) {
      console.error(`[AnestesiaPro Server] Error reading ${filePath}:`, e);
    }
    return fallback;
  };

  const writeJsonFile = (filePath: string, data: any): boolean => {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error(`[AnestesiaPro Server] Error writing ${filePath}:`, e);
      return false;
    }
  };

  const educationResourcesFile = path.join(publicDir, "education_resources.json");
  const notificationsFile = path.join(publicDir, "notifications.json");
  const statsFile = path.join(publicDir, "app_stats.json");
  const adminEventsFile = path.join(publicDir, "admin_events.json");
  const feedbackFile = path.join(publicDir, "user_feedback.json");

  // API Routes FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // ==========================================
  // EDUCATION RESOURCES (SHARED PUBLIC LIBRARY)
  // ==========================================

  const OFFICIAL_CIPROFOL_RESOURCE = {
    id: "res-ciprofol-hsk3486-hipnotico-gabaa-2026",
    title: "Ciprofol (HSK3486): Nuevo Agente Anestésico e Hipnótico GABAA — Atlas de Láminas HD, Dosis y Perlas Perioperatorias",
    category: "infografia",
    description: "Ciprofol (HSK3486): Agente anestésico intravenoso de última generación modulador alostérico positivo del receptor GABA-A. 4 a 5 veces más potente que propofol con mayor índice terapéutico, preservación hemodinámica superior y ausencia de dolor a la inyección venosa.",
    date: "2026-09-12",
    author: "Dr. Carlos Leal • Especialista en Anestesiología y Reanimación • Vanguardia Farmacológica",
    url: "/images/ciprofol/slide_1_mecanismo_gabaa.svg",
    fileName: "Guia_Oficial_Ciprofol_HSK3486_Dr_Carlos_Leal.pdf",
    fileSize: "6 Láminas Ultra-HD",
    fileExtension: "svg",
    tags: ["#Ciprofol", "#HSK3486", "#GABAA", "#TIVA", "#Sedacion", "#Vademecum", "#AnestesiaPro", "#DrCarlosLeal"],
    downloadable: true,
    isCarousel: true,
    images: [
      "/images/ciprofol/slide_1_mecanismo_gabaa.svg",
      "/images/ciprofol/slide_2_farmacocinetica_farmacodinamia.svg",
      "/images/ciprofol/slide_3_dosificacion_clinica_tiva.svg",
      "/images/ciprofol/slide_4_estabilidad_hemodinamica.svg",
      "/images/ciprofol/slide_5_dolor_inyeccion_tolerancia.svg",
      "/images/ciprofol/slide_6_comparativa_ciprofol_vs_propofol.svg"
    ],
    imageCaptions: [
      "Lámina 1: Mecanismo de Acción Celular y Receptor GABA-A",
      "Lámina 2: Farmacocinética de 3 Compartimentos y Aclaramiento Plasmático",
      "Lámina 3: Dosificación Clínica de Precisión: Inducción, Mantenimiento y Sedación",
      "Lámina 4: Estabilidad Cardiovascular y Hemodinamia Comparada",
      "Lámina 5: Tolerancia Vascular: Erradicación del Dolor a la Inyección",
      "Lámina 6: Cuadro Comparativo Global Ciprofol (HSK3486) vs Propofol"
    ]
  };

  const VALID_AUTHOR_PINS = ["2534", "1234", "ANESTESIAPRO", "ADMIN", "CARLOS", "CARLOSLEAL"];

  function isAuthorizedAuthor(req: express.Request): boolean {
    const headerPin = req.headers["x-author-pin"] as string;
    const bodyPin = req.body?.authorPin || req.body?.pin;
    const queryPin = req.query?.pin as string;
    const candidate = (headerPin || bodyPin || queryPin || "").toString().trim().toUpperCase();
    return VALID_AUTHOR_PINS.includes(candidate);
  }

  // Get all shared education resources
  app.get("/api/education/resources", (_req, res) => {
    let list = readJsonFile<any[]>(educationResourcesFile, []);
    
    // Ensure Ciprofol is always present in server resources
    if (!list.some((r) => r.id === OFFICIAL_CIPROFOL_RESOURCE.id)) {
      list.unshift(OFFICIAL_CIPROFOL_RESOURCE);
      writeJsonFile(educationResourcesFile, list);
    }
    
    res.json({ success: true, resources: list });
  });

  // Batch or Single Resource Upload & Persistence (Author Protected)
  app.post("/api/education/resources", (req, res) => {
    try {
      if (!isAuthorizedAuthor(req)) {
        return res.status(403).json({ 
          error: "Acceso denegado. Solo el Dr. Carlos Leal (Autor/Administrador) puede publicar o modificar recursos educativos.",
          success: false 
        });
      }

      const payload = req.body;
      const incomingItems = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.resources)
        ? payload.resources
        : payload.resource
        ? [payload.resource]
        : [payload];

      if (!incomingItems.length) {
        return res.status(400).json({ error: "No resources provided" });
      }

      let existingResources = readJsonFile<any[]>(educationResourcesFile, []);
      const processedResources: any[] = [];

      for (const item of incomingItems) {
        if (!item || !item.title) continue;

        const itemId = item.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        let fileUrl = item.url;
        let fileExtension = item.fileExtension || "file";
        let fileName = item.fileName || `${item.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.${fileExtension}`;

        // If fileDataUrl is present, write to disk in /public/uploads/ for ultra-fast serving
        if (item.fileDataUrl && typeof item.fileDataUrl === "string" && item.fileDataUrl.startsWith("data:")) {
          try {
            const matches = item.fileDataUrl.match(/^data:([^;]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const mime = matches[1];
              const b64 = matches[2];
              const buffer = Buffer.from(b64, "base64");

              let detectedExt = fileExtension;
              if (mime.includes("pdf")) detectedExt = "pdf";
              else if (mime.includes("jpeg") || mime.includes("jpg")) detectedExt = "jpg";
              else if (mime.includes("png")) detectedExt = "png";
              else if (mime.includes("webp")) detectedExt = "webp";
              else if (mime.includes("mp4")) detectedExt = "mp4";

              const cleanBase = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
              const safeDiskName = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}_${cleanBase}.${detectedExt}`;
              const targetPath = path.join(uploadsDir, safeDiskName);

              fs.writeFileSync(targetPath, buffer);
              fileUrl = `/uploads/${safeDiskName}`;
              fileExtension = detectedExt;
              console.log(`[AnestesiaPro Server] Saved uploaded file to disk: ${targetPath} (${buffer.length} bytes)`);
            }
          } catch (e) {
            console.error("[AnestesiaPro Server] Error saving file to disk:", e);
          }
        }

        // If item has multiple carousel images, save each image to disk in /uploads/
        let savedImages: string[] = [];
        if (Array.isArray(item.images) && item.images.length > 0) {
          for (let imgIdx = 0; imgIdx < item.images.length; imgIdx++) {
            const imgData = item.images[imgIdx];
            if (typeof imgData === "string" && imgData.startsWith("data:")) {
              try {
                const matches = imgData.match(/^data:([^;]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                  const mime = matches[1];
                  const b64 = matches[2];
                  const buffer = Buffer.from(b64, "base64");
                  let ext = "jpg";
                  if (mime.includes("png")) ext = "png";
                  else if (mime.includes("webp")) ext = "webp";
                  const safeDiskName = `${Date.now()}_carousel_${imgIdx}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
                  const targetPath = path.join(uploadsDir, safeDiskName);
                  fs.writeFileSync(targetPath, buffer);
                  savedImages.push(`/uploads/${safeDiskName}`);
                } else {
                  savedImages.push(imgData);
                }
              } catch (e) {
                console.error("[AnestesiaPro Server] Error saving carousel image:", e);
                savedImages.push(imgData);
              }
            } else if (typeof imgData === "string") {
              savedImages.push(imgData);
            }
          }
        }

        const isCarouselItem = Boolean(item.isCarousel || savedImages.length > 1 || (Array.isArray(item.images) && item.images.length > 1));
        if (isCarouselItem && savedImages.length > 0 && !fileUrl) {
          fileUrl = savedImages[0];
        }

        const newOrUpdated = {
          id: itemId,
          title: item.title,
          category: item.category || (isCarouselItem ? "infografia" : "pdf"),
          description: item.description || "",
          date: item.date || new Date().toISOString().split("T")[0],
          author: item.author || "Dr. Carlos Leal • AnestesiaPro",
          url: fileUrl || item.url,
          fileName: fileName,
          fileSize: item.fileSize || (isCarouselItem ? `${savedImages.length || item.images?.length || 0} fotos` : "Archivo Clínico"),
          fileExtension: fileExtension,
          fileType: item.fileType,
          // Keep lightweight dataUrl or remove if file saved to disk
          fileDataUrl: item.fileDataUrl && item.fileDataUrl.length < 500000 ? item.fileDataUrl : undefined,
          tags: Array.isArray(item.tags) ? item.tags : ["#EducaciónContinua", "#AnestesiaPro"],
          instagramUrl: item.instagramUrl,
          videoUrl: item.videoUrl,
          downloadable: item.downloadable !== false,
          isCommunity: true,
          isCustom: true,
          images: savedImages.length > 0 ? savedImages : item.images,
          isCarousel: isCarouselItem,
          imageCaptions: Array.isArray(item.imageCaptions) ? item.imageCaptions : undefined,
          createdAt: item.createdAt || new Date().toISOString()
        };

        const existingIdx = existingResources.findIndex((r) => r.id === itemId);
        if (existingIdx !== -1) {
          existingResources[existingIdx] = { ...existingResources[existingIdx], ...newOrUpdated };
        } else {
          existingResources.unshift(newOrUpdated);
        }
        processedResources.push(newOrUpdated);
      }

      writeJsonFile(educationResourcesFile, existingResources);

      // Automatically broadcast notification for all devices
      if (processedResources.length > 0) {
        try {
          const currentNotifs = readJsonFile<any[]>(notificationsFile, []);
          const firstItem = processedResources[0];
          const isCarousel = Boolean(firstItem.isCarousel || (firstItem.images && firstItem.images.length > 1));
          const notifId = `notif-upload-${Date.now()}`;
          const notifTitle = isCarousel 
            ? `📸 ¡NUEVO ÁLBUM CLÍNICO: ${firstItem.title}!` 
            : `📄 ¡NUEVO RECURSO: ${firstItem.title}!`;
          const notifMsg = isCarousel
            ? `El Dr. Carlos Leal ha publicado un álbum interactivo con ${firstItem.images?.length || 5} láminas HD deslizables en Educación Continua.`
            : (firstItem.description || "Nuevo material clínico oficial disponible en la Biblioteca de Educación Continua.");

          // Avoid duplicate notification for same item id within 5 minutes
          if (!currentNotifs.some(n => n.resourceId === firstItem.id)) {
            currentNotifs.unshift({
              id: notifId,
              title: notifTitle,
              message: notifMsg,
              date: new Date().toISOString().split("T")[0],
              badge: isCarousel ? "CARRUSEL HD" : "PUBLICACIÓN",
              resourceId: firstItem.id,
              author: firstItem.author || "Dr. Carlos Leal"
            });
            writeJsonFile(notificationsFile, currentNotifs.slice(0, 25));
            console.log(`[AnestesiaPro Server] Created notification for uploaded resource ${firstItem.id}`);
          }
        } catch (notifErr) {
          console.warn("[AnestesiaPro Server] Warning creating auto-notification:", notifErr);
        }
      }

      console.log(`[AnestesiaPro Server] Successfully saved and synced ${processedResources.length} resources. Total in library: ${existingResources.length}`);

      return res.json({
        success: true,
        count: processedResources.length,
        uploaded: processedResources,
        allResources: existingResources
      });
    } catch (err: any) {
      console.error("[AnestesiaPro Server] Error handling education resource upload:", err);
      return res.status(500).json({ error: err?.message || "Internal error saving resource" });
    }
  });

  // Delete an education resource (Author Protected)
  app.delete("/api/education/resources/:id", (req, res) => {
    try {
      if (!isAuthorizedAuthor(req)) {
        return res.status(403).json({ 
          error: "Acceso denegado. Solo el Dr. Carlos Leal (Autor/Administrador) puede eliminar recursos educativos.",
          success: false 
        });
      }

      const { id } = req.params;
      let existingResources = readJsonFile<any[]>(educationResourcesFile, []);
      const target = existingResources.find((r) => r.id === id);

      if (!target) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // If file was stored in /uploads/, delete it from disk
      if (target.url && target.url.startsWith("/uploads/")) {
        const localFileName = target.url.replace(/^\/uploads\//, "").split("?")[0];
        const filePath = path.join(uploadsDir, localFileName);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`[AnestesiaPro Server] Deleted file from disk: ${filePath}`);
          } catch (e) {
            console.warn(`[AnestesiaPro Server] Failed to delete file ${filePath}:`, e);
          }
        }
      }

      existingResources = existingResources.filter((r) => r.id !== id);
      writeJsonFile(educationResourcesFile, existingResources);

      return res.json({ success: true, id, remaining: existingResources.length });
    } catch (err: any) {
      console.error("[AnestesiaPro Server] Error deleting resource:", err);
      return res.status(500).json({ error: err?.message || "Internal server error" });
    }
  });

  // ==========================================
  // NOTIFICATIONS API
  // ==========================================
  app.get("/api/notifications", (_req, res) => {
    const notifs = readJsonFile<any[]>(notificationsFile, [
      {
        id: "notif-emotive-2026",
        title: "🩸 ¡NUEVO RECURSO: PROTOCOLO E-MOTIVE EN HEMORRAGIA POSPARTO (NEJM / OMS / FIGO / SOAP)! 🚨",
        message: "Se ha publicado la Guía Oficial y el Atlas Visual Clínico interactivo de alta fidelidad sobre el Protocolo E-MOTIVE.",
        date: "2026-08-31",
        badge: "URGENCIA OBSTÉTRICA 🩸",
        resourceId: "res-protocolo-emotive-hpp",
        author: "Dr. Carlos Leal"
      }
    ]);
    res.json({ success: true, notifications: notifs });
  });

  app.post("/api/notifications", (req, res) => {
    try {
      const notifData = req.body;
      const currentNotifs = readJsonFile<any[]>(notificationsFile, []);
      const newNotif = {
        id: notifData.id || `notif-${Date.now()}`,
        title: notifData.title,
        message: notifData.message,
        date: notifData.date || new Date().toISOString().split("T")[0],
        badge: notifData.badge || "ACTUALIZACIÓN",
        resourceId: notifData.resourceId || "",
        author: notifData.author || "Dr. Carlos Leal"
      };

      currentNotifs.unshift(newNotif);
      writeJsonFile(notificationsFile, currentNotifs);
      res.json({ success: true, notification: newNotif });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Error saving notification" });
    }
  });

  // ==========================================
  // STATS API
  // ==========================================
  app.get("/api/stats/summary", (_req, res) => {
    const stats = readJsonFile<any>(statsFile, {
      visits: 865,
      appInstalls: 204,
      uniqueDevices: 404,
      totalDownloads: 910,
      itemDownloads: {}
    });
    res.json({ success: true, stats });
  });

  app.post("/api/stats/visit", (req, res) => {
    try {
      const current = readJsonFile<any>(statsFile, {
        visits: 865,
        appInstalls: 204,
        uniqueDevices: 404,
        totalDownloads: 910,
        itemDownloads: {}
      });
      current.visits = Math.max((Number(current.visits) || 0) + 1, Number(req.body.clientVisits) || 0);
      writeJsonFile(statsFile, current);
      res.json({ success: true, stats: current });
    } catch (e) {
      res.json({ success: true });
    }
  });

  app.post("/api/stats/install", (req, res) => {
    try {
      const current = readJsonFile<any>(statsFile, {
        visits: 865,
        appInstalls: 204,
        uniqueDevices: 404,
        totalDownloads: 910,
        itemDownloads: {}
      });
      current.appInstalls = Math.max((Number(current.appInstalls) || 0) + 1, Number(req.body.clientAppInstalls) || 0);
      writeJsonFile(statsFile, current);
      res.json({ success: true, stats: current });
    } catch (e) {
      res.json({ success: true });
    }
  });

  app.post("/api/stats/download", (req, res) => {
    try {
      const current = readJsonFile<any>(statsFile, {
        visits: 865,
        appInstalls: 204,
        uniqueDevices: 404,
        totalDownloads: 910,
        itemDownloads: {}
      });
      current.totalDownloads = (Number(current.totalDownloads) || 0) + 1;
      const resId = req.body.resourceId;
      if (resId) {
        current.itemDownloads = current.itemDownloads || {};
        current.itemDownloads[resId] = (Number(current.itemDownloads[resId]) || 0) + 1;
      }
      writeJsonFile(statsFile, current);
      res.json({ success: true, stats: current });
    } catch (e) {
      res.json({ success: true });
    }
  });

  // Admin stats update / manual calibration & reset endpoint (Protected by PIN 2534)
  app.post("/api/admin/stats/update", (req, res) => {
    try {
      const { pin, updates } = req.body;
      if (pin !== "2534" && pin !== "2026") {
        return res.status(403).json({ error: "PIN no autorizado" });
      }

      let current = readJsonFile<any>(statsFile, {
        visits: 865,
        appInstalls: 204,
        uniqueDevices: 404,
        totalDownloads: 910,
        itemDownloads: {}
      });

      if (updates?.resetAll) {
        current = {
          visits: 1,
          appInstalls: 0,
          uniqueDevices: 1,
          totalDownloads: 0,
          itemDownloads: {},
          devices: { "Smartphone (Móvil) 📱": 1 },
          locations: { "🇻🇪 Venezuela": 1 }
        };
      } else if (updates) {
        if (updates.visits !== undefined) current.visits = Number(updates.visits);
        if (updates.appInstalls !== undefined) current.appInstalls = Number(updates.appInstalls);
        if (updates.uniqueDevices !== undefined) current.uniqueDevices = Number(updates.uniqueDevices);
        if (updates.totalDownloads !== undefined) current.totalDownloads = Number(updates.totalDownloads);
        if (updates.itemDownloads !== undefined) current.itemDownloads = updates.itemDownloads;
        if (updates.devices !== undefined) current.devices = updates.devices;
        if (updates.locations !== undefined) current.locations = updates.locations;
      }

      writeJsonFile(statsFile, current);

      if (updates?.clearEvents) {
        writeJsonFile(adminEventsFile, []);
      }

      res.json({ success: true, stats: current });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Error al actualizar estadísticas" });
    }
  });

  // Admin activity events log
  app.get("/api/admin/events", (_req, res) => {
    const events = readJsonFile<any[]>(adminEventsFile, []);
    res.json({ success: true, events });
  });

  app.post("/api/admin/events", (req, res) => {
    try {
      const { type, title, detail, device, location } = req.body;
      const events = readJsonFile<any[]>(adminEventsFile, []);
      const newEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: type || "explore",
        title: title || "Actividad",
        detail: detail || "",
        device: device || "Smartphone (Móvil) 📱",
        location: location || "🇻🇪 Venezuela",
        timestamp: new Date().toISOString(),
        timeMs: Date.now()
      };
      events.unshift(newEvent);
      if (events.length > 300) events.length = 300;
      writeJsonFile(adminEventsFile, events);
      res.json({ success: true, event: newEvent });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Error logging event" });
    }
  });

  app.post("/api/admin/events/clear", (req, res) => {
    const { pin } = req.body;
    if (pin !== "2534" && pin !== "2026") {
      return res.status(403).json({ error: "PIN no autorizado" });
    }
    writeJsonFile(adminEventsFile, []);
    res.json({ success: true });
  });

  // Feedback suggestions
  app.get("/api/feedback", (_req, res) => {
    const list = readJsonFile<any[]>(feedbackFile, []);
    res.json({ success: true, suggestions: list });
  });

  app.post("/api/feedback", (req, res) => {
    try {
      const data = req.body;
      const list = readJsonFile<any[]>(feedbackFile, []);
      const newFeedback = {
        id: `feedback-${Date.now()}`,
        name: data.name || "Colega Anónimo",
        email: data.email || "",
        location: data.location || "Sin especificar",
        message: data.message || "",
        date: new Date().toISOString().replace("T", " ").substring(0, 16)
      };
      list.unshift(newFeedback);
      writeJsonFile(feedbackFile, list);
      res.json({ success: true, feedback: newFeedback });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Error saving feedback" });
    }
  });

  app.delete("/api/feedback/:id", (req, res) => {
    try {
      const { id } = req.params;
      let list = readJsonFile<any[]>(feedbackFile, []);
      list = list.filter((f) => f.id !== id);
      writeJsonFile(feedbackFile, list);
      res.json({ success: true, remaining: list.length });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Error deleting feedback" });
    }
  });

  // Endpoint to save custom official images (FONA, CPPD, etc.) permanently
  app.post("/api/admin/save-official-image", (req, res) => {
    try {
      const { type, dataUrl } = req.body;
      if (!type || !dataUrl) {
        return res.status(400).json({ error: "Missing type or dataUrl" });
      }

      // Extract format and base64 data
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid data URL format" });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      let extension = "jpg";
      if (mimeType.includes("png")) extension = "png";
      else if (mimeType.includes("svg")) extension = "svg";
      else if (mimeType.includes("webp")) extension = "webp";

      const fileName = `custom_${type}.${extension}`;
      const publicDir = path.join(process.cwd(), "public");
      const imagesDir = path.join(publicDir, "images");

      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      const filePath = path.join(imagesDir, fileName);
      fs.writeFileSync(filePath, buffer);

      // Also update custom_assets_config.json
      const configPath = path.join(publicDir, "custom_assets_config.json");
      let config: Record<string, string> = {};
      if (fs.existsSync(configPath)) {
        try {
          config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } catch {
          config = {};
        }
      }

      const relativeUrl = `/images/${fileName}?v=${Date.now()}`;
      config[type] = relativeUrl;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

      console.log(`[AnestesiaPro] Saved official image for ${type}: ${filePath} (${buffer.length} bytes)`);

      return res.json({
        success: true,
        type,
        url: relativeUrl,
        size: buffer.length
      });
    } catch (err: any) {
      console.error("[AnestesiaPro] Error saving official image:", err);
      return res.status(500).json({ error: err?.message || "Internal server error" });
    }
  });

  // Get current official custom assets config
  app.get("/api/admin/custom-assets", (_req, res) => {
    try {
      const configPath = path.join(process.cwd(), "public", "custom_assets_config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        return res.json({ success: true, assets: config });
      }
      return res.json({ success: true, assets: {} });
    } catch {
      return res.json({ success: true, assets: {} });
    }
  });

  // Vite middleware for development vs static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Disable aggressive caching for index.html and sw.js so changes deploy instantly
    app.use((req, res, next) => {
      if (req.path === "/" || req.path === "/index.html" || req.path === "/sw.js") {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
      next();
    });

    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html") || filePath.endsWith("sw.js")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
        }
      }
    }));
    app.get("*", (_req, res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AnestesiaPro Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
