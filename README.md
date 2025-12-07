#  Signature Injection Engine

A modern web application for placing digital signatures, text, and dates on PDF documents with pixel-perfect coordinate conversion between browser and PDF formats.

**Live Demo:** https://signature-engine.netlify.app

**Backend API:** https://signature-engine.onrender.com

---

##  Features

-  **Drag & Drop Interface** - Intuitive field placement on PDF documents
-  **PDF Rendering** - Real-time PDF preview using PDF.js
-  **Multiple Field Types** - Signature, Text, Date, Checkbox, Radio, Image
-  **Responsive Design** - Works seamlessly across desktop and mobile
-  **Coordinate Conversion** - Accurate browser-to-PDF coordinate mapping
-  **Security** - SHA-256 hashing for document integrity verification
-  **Direct Download** - Signed PDFs download directly to your browser

---

##  Screenshot

### Editor Interface
![ Preview](https://github.com/user-attachments/assets/0c4672a4-e3e0-4701-8b3e-cab5f9cd60dc)


---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **PDF.js** - PDF rendering
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **pdf-lib** - PDF manipulation
- **MongoDB** - Database 
- **Crypto** - SHA-256 hashing

---

## 📁 Project Structure

```
signature-engine/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFViewer.jsx          # PDF rendering component
│   │   │   ├── FieldPalette.jsx       # Field selection sidebar
│   │   │   └── Canvas.jsx             # Field placement canvas
│   │   ├── pages/
│   │   │   └── Editor.jsx             # Main editor page
│   │   ├── hooks/
│   │   │   └── useResponsive.js       # Responsive utilities
│   │   ├── utils/
│   │   │   └── coordinateHelper.js    # Browser-to-PDF conversion
│   │   ├── App.jsx                    # Main app component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── public/
│   │   ├── sample.pdf                 # Sample PDF for testing
│   │   ├── pdf.worker.min.js          # PDF.js worker
│   │   └── vite.svg                   # Logo
│   ├── package.json
│   ├── vite.config.js
│   ├── netlify.toml
│   ├── .env
│   └── index.html
│
├── backend/
│   ├── controllers/
│   │   └── pdfController.js           # PDF signing logic
│   ├── routes/
│   │   └── pdf.js                     # API routes
│   ├── middleware/
│   │   └── errorHandler.js            # Error handling
│   ├── models/
│   │   └── PdfRecord.js               # MongoDB schema
│   ├── utils/
│   │   └── hashCalculator.js          # SHA-256 hashing
│   ├── pdfs/
│   │   └── sample.pdf                 # Source PDF
│   ├── server.js                      # Express server
│   ├── package.json
│   ├── .env
│   └── Procfile                       # Render config
│
├── netlify.toml                       # Netlify config
├── render.yaml                        # Render config
├── .gitignore
└── README.md
```

---

##  Getting Started

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/prathamesonar/signature-engine.git
cd signature-engine
```

**2. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

**3. Setup Backend** (new terminal)
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

##  API Endpoints

### POST `/sign-pdf`
Signs a PDF with signature image and field coordinates.

**Request:**
```json
{
  "signature": "data:image/png;base64,...",
  "fields": [
    {
      "id": 1765123980793,
      "type": "signature",
      "pdfCoord": {
        "x": 156.49,
        "y": 593.46,
        "width": 79.96,
        "height": 26.67
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "originalHash": "10efd1e49f8b7bdd13c7740864b187e8bfacc165809a1a1b18bf81e22310c5b5",
  "finalHash": "35d8efdbf8de2b17e6cd989ccd5a7fb16dd59faf81e02ed87eaedbe8f24c93f3"
}
```

---

## 📝 Field Types

| Type | Description |
|------|-------------|
| Signature | Embedded signature image |
| Text | Static text field |
| Date | Auto-filled date |
| Checkbox | Checkmark indicator |
| Radio | Radio button |
| Image | Embedded image |

---

##  Security

- **CORS Enabled** - Controlled cross-origin requests
- **Input Validation** - All inputs validated on backend
- **SHA-256 Hashing** - Document integrity verification
- **MongoDB Audit Trail** - All signing events logged
- **HTTPS Only** - Production uses encrypted connections
