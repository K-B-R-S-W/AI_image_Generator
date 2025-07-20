# 🎨 AI Image Generator 🎨

Transform your words and voice into stunning AI-generated images! This project uses AI to generate images from text descriptions or recorded speech, featuring a modern frontend interface and a powerful AI backend.

## 🌟 Features

### Core Features
- 🗣️ **Voice to Image**: Convert your speech into AI-generated images
- ✍️ **Text to Image**: Enter a description and get an AI-generated image
- 📚 **History Tracking**: View past generations with a clear history feature
- ⚡ **Real time Updates**: Live status and processing feedback

### Frontend Features
- ✨ Beautiful Animations and Glassmorphism Design
- 🌙 Dark Mode Support
- 📱 Responsive Design
- 🎯 Interactive UI Elements

### Backend Features
- 🎤 Speech-to-Text using Whisper AI
- 🖼️ Advanced Image Generation
- 🔁 Audio Format Conversion
- 🛜 RESTful API Endpoints
- 🔐 Secure File Handling

## 📂 Project Structure

```
ai-image-generator/
├── frontend/               # Modern JavaScript frontend
│   ├── src/
│   │   ├── assets/        # Static assets (images, styles)
│   │   ├── js/           # JavaScript modules
│   │   │   ├── constants/  # Configuration and constants
│   │   │   ├── services/   # Service modules
│   │   │   └── app.js      # Main application
│   │   └── index.html    # Main HTML file
│   └── package.json      # Frontend dependencies
│
├── ai-backend/            # Python-based AI backend
│   ├── Main.ipynb        # Colab notebook
│   └── requirements.txt   # Python dependencies
```

## ⚙️ Tech Stack

### Frontend
- 🔰 Vanilla JavaScript (ES6+)
- 🎨 Modern CSS with Variables and Animations
- 📄 HTML5 with Semantic Elements
- ⚡ Vite for Development
- 🧹 ESLint & Prettier
- 🎯 Font Awesome Icons
- 🔤 Google Fonts (Poppins)
- 🎵 LameJS for MP3 Encoding

### Backend
- 🐍 Python
- 🤖 Whisper AI (large)
- 🌐 Flask & Flask-CORS
- 🔥 PyTorch & Torchaudio
- 🤗 Transformers (Hugging Face)
- 🧠 OpenAI API
- 📊 NumPy & Pillow (PIL)
- 🔊 pydub

## 🚀 Getting Started

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Additional commands:
   ```bash
   npm run build 
   npm run preview 
   npm run lint     
   npm run format  
   ```

### Backend Setup
1. Open `ai-backend/Main.ipynb` in Google Colab
2. Install dependencies:
   ```python
   !pip install -r requirements.txt
   ```
3. Set up environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Run all cells in the notebook
5. Copy the generated Ngrok URL
6. Update the API URL in `frontend/src/js/constants/config.js`

## 🔌 API Endpoints

### POST /transcribe
Handles both text and audio inputs for image generation.

#### Text Input
```json
{
    "text": "A beautiful sunset over mountains"
}
```

#### Audio Input
```json
{
    "audio": "base64_encoded_audio",
    "filename": "recorded_audio.mp3"
}
```

#### Response
```json
{
    "image": "base64_encoded_image",
    "text": "transcribed_text"
}
```

## 🏗️ Architecture

The project follows a modular architecture with clear separation of concerns:

### Frontend Services
- 🌐 **ApiService**: Handles all API communications
- 🎙️ **AudioService**: Manages audio recording and processing
- 🖥️ **UIService**: Controls UI updates and interactions
- ⚡ **App**: Main application orchestrator

### Browser Support
- 🌐 Chrome (latest)
- 🦊 Firefox (latest)
- 🧭 Safari (latest)
- 🔷 Edge (latest)

## 🛡️ Security Features
- 🔒 Secure audio processing
- ✅ Input validation
- 🚧 CORS protection
- 🔑 Environment variable management
- 💾 Memory-efficient file handling
- 🧹 Proper cleanup of temporary files

## 👥 Contributing
1. 🔱 Fork the repository
2. 🌿 Create your feature branch
3. 💫 Commit your changes
4. ⬆️ Push to the branch
5. 🎯 Create a Pull Request

---

## 📮 Support

- **📧 Email:** [k.b.ravindusankalpaac@gmail.com](mailto:k.b.ravindusankalpaac@gmail.com)  
- **🐞 Bug Reports:** [GitHub Issues](https://github.com/K-B-R-S-W/Student_Management_System/issues)  
- **📚 Documentation:** See the project [Wiki](https://github.com/K-B-R-S-W/Student_Management_System/wiki)  
- **💭 Discussions:** Join the [GitHub Discussions](https://github.com/K-B-R-S-W/Student_Management_System/discussions)

---

## ⭐ Support This Project

If you find this project helpful, please consider giving it a **⭐ star** on GitHub!