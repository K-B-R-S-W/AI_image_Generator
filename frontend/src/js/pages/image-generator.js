// Image Generator Page Module
import { ApiService } from '../services/ApiService.js';
import { AudioService } from '../services/AudioService.js';
import { UIService } from '../services/UIService.js';

export class ImageGenerator {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'image-generator-page';
        this.createContent();
    }

    createContent() {
        this.container.innerHTML = `
            <div class="glass-card">
                <!-- Header Section -->
                <header class="header">
                    <div class="logo-animation">
                        <div class="magic-wand">
                            <i class="fas fa-sparkles"></i>
                        </div>
                        <h1 class="title">AI Image Generator <i class="fas fa-palette title-icon"></i></h1>
                    </div>
                    <p class="subtitle typewriter">Transform your words and voice into stunning images</p>
                </header>

                <!-- Input Section -->
                <div class="input-section">
                    <div class="input-container">
                        <div class="input-wrapper hover-effect">
                            <input 
                                type="text" 
                                id="textInput" 
                                placeholder="Describe your imagination..."
                                aria-label="Image description input"
                                class="glow-effect"
                            >
                            <button id="sendTextButton" class="btn generate-btn pulse" aria-label="Generate image">
                                <i class="fas fa-wand-magic-sparkles"></i>
                                Generate
                            </button>
                        </div>
                        
                        <div class="divider">
                            <span class="bounce">or</span>
                        </div>

                        <button id="recordButton" class="btn record-btn hover-float" aria-label="Record audio">
                            <i class="fas fa-microphone"></i>
                            <span>Record Voice</span>
                        </button>
                    </div>

                    <!-- Status Messages -->
                    <div id="status" class="status" role="status" aria-live="polite"></div>
                    <div id="transcription" class="transcription" aria-live="polite"></div>
                </div>

                <!-- Image Display Section -->
                <div class="image-container">
                    <div class="image-wrapper hover-shadow">
                        <img id="generatedImage" src="" alt="Generated Image" class="fade-in">
                        <div class="loading-spinner heart-beat" aria-hidden="true">
                            <div class="spinner"></div>
                        </div>
                    </div>
                    <!-- Download Format Options -->
                    <div class="download-options">
                        <button id="downloadPng" class="btn download-btn" disabled>
                            <i class="fas fa-download"></i> PNG
                        </button>
                        <button id="downloadJpeg" class="btn download-btn" disabled>
                            <i class="fas fa-download"></i> JPEG
                        </button>
                        <button id="downloadSvg" class="btn download-btn" disabled>
                            <i class="fas fa-download"></i> SVG
                        </button>
                    </div>
                </div>

                <!-- History Section -->
                <div class="history-container fade-in">
                    <div class="history-header">
                        <h2><i class="fas fa-history"></i> Generation History</h2>
                        <button id="clearHistoryBtn" class="btn clear-btn hover-rotate" aria-label="Clear history">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div id="chatHistory" class="chat-history"></div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Initialize services
        this.apiService = new ApiService();
        this.audioService = new AudioService();

        // Get DOM elements
        const textInput = this.container.querySelector('#textInput');
        const sendTextButton = this.container.querySelector('#sendTextButton');
        const recordButton = this.container.querySelector('#recordButton');
        const downloadButtons = this.container.querySelectorAll('.download-btn');
        const clearHistoryBtn = this.container.querySelector('#clearHistoryBtn');
        const status = this.container.querySelector('#status');
        const transcription = this.container.querySelector('#transcription');

        if (!textInput || !sendTextButton || !recordButton) {
            console.error('Required elements not found');
            return;
        }

        // Setup event listeners
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateImage(textInput.value);
            }
        });

        sendTextButton.addEventListener('click', () => {
            this.generateImage(textInput.value);
        });

        recordButton.addEventListener('click', () => {
            this.handleRecordButtonClick();
        });

        downloadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const format = button.textContent.trim().toLowerCase();
                this.downloadImage(format);
            });
        });

        clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });
    }

    async generateImage(prompt) {
        if (!prompt.trim()) return;

        const textInput = this.container.querySelector('#textInput');
        const sendTextButton = this.container.querySelector('#sendTextButton');
        const loadingSpinner = this.container.querySelector('.loading-spinner');
        const generatedImage = this.container.querySelector('#generatedImage');
        const downloadButtons = this.container.querySelectorAll('.download-btn');
        const status = this.container.querySelector('#status');

        // Disable input and show loading state
        textInput.disabled = true;
        sendTextButton.disabled = true;
        loadingSpinner.classList.add('visible');
        generatedImage.style.display = 'none';
        status.textContent = 'Generating image...';

        try {
            const imageUrl = await this.apiService.generateImage(prompt);
            
            // Show generated image
            generatedImage.src = imageUrl;
            generatedImage.style.display = 'block';
            generatedImage.classList.add('visible');

            // Enable download buttons
            downloadButtons.forEach(button => button.disabled = false);

            // Add to history
            this.addToHistory(prompt, imageUrl);
            status.textContent = 'Image generated successfully!';
        } catch (error) {
            console.error('Error generating image:', error);
            status.textContent = 'Failed to generate image. Please try again.';
        } finally {
            // Reset UI state
            textInput.disabled = false;
            sendTextButton.disabled = false;
            loadingSpinner.classList.remove('visible');
            textInput.value = '';
        }
    }

    async handleRecordButtonClick() {
        const recordButton = this.container.querySelector('#recordButton');
        const status = this.container.querySelector('#status');
        const transcription = this.container.querySelector('#transcription');

        if (!recordButton.classList.contains('recording')) {
            try {
                recordButton.classList.add('recording');
                recordButton.innerHTML = '<i class="fas fa-stop"></i><span>Stop Recording</span>';
                status.textContent = 'Recording...';

                await this.audioService.startRecording();
            } catch (error) {
                console.error('Error starting recording:', error);
                status.textContent = 'Failed to start recording. Please check your microphone permissions.';
                recordButton.classList.remove('recording');
                recordButton.innerHTML = '<i class="fas fa-microphone"></i><span>Record Voice</span>';
            }
        } else {
            try {
                recordButton.classList.remove('recording');
                recordButton.innerHTML = '<i class="fas fa-microphone"></i><span>Record Voice</span>';
                status.textContent = 'Processing audio...';

                const audioData = await this.audioService.stopRecording();
                if (!audioData) {
                    throw new Error('No audio data received');
                }

                const text = await this.apiService.transcribeAudio(audioData);
                if (!text) {
                    throw new Error('No transcription received');
                }

                transcription.textContent = `Transcription: ${text}`;
                await this.generateImage(text);
            } catch (error) {
                console.error('Error processing audio:', error);
                status.textContent = 'Failed to process audio. Please try again.';
            }
        }
    }

    downloadImage(format) {
        const generatedImage = this.container.querySelector('#generatedImage');
        if (!generatedImage.src) return;

        const link = document.createElement('a');
        link.href = generatedImage.src;
        link.download = `generated-image.${format}`;
        link.click();
    }

    addToHistory(prompt, imageUrl) {
        const chatHistory = this.container.querySelector('#chatHistory');
        const entry = document.createElement('div');
        entry.className = 'chat-entry';
        entry.innerHTML = `
            <img src="${imageUrl}" alt="Generated image" class="history-image">
            <p class="history-prompt">${prompt}</p>
        `;
        chatHistory.insertBefore(entry, chatHistory.firstChild);
    }

    clearHistory() {
        const chatHistory = this.container.querySelector('#chatHistory');
        chatHistory.innerHTML = '';
    }

    getElement() {
        // Setup event listeners when the element is requested
        this.setupEventListeners();
        return this.container;
    }
} 