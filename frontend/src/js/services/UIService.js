import { config } from '../constants/config.js';

export class UIService {
    constructor() {
        this.elements = {
            recordButton: document.getElementById('recordButton'),
            sendTextButton: document.getElementById('sendTextButton'),
            textInput: document.getElementById('textInput'),
            statusDiv: document.getElementById('status'),
            transcriptionDiv: document.getElementById('transcription'),
            generatedImage: document.getElementById('generatedImage'),
            chatHistory: document.getElementById('chatHistory'),
            loadingSpinner: document.querySelector('.loading-spinner'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            // Add new elements
            downloadPngBtn: document.getElementById('downloadPng'),
            downloadJpegBtn: document.getElementById('downloadJpeg'),
            downloadSvgBtn: document.getElementById('downloadSvg')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.generatedImage.addEventListener('load', () => {
            this.hideLoading();
            this.elements.generatedImage.classList.add('visible');
            this.enableDownloadButtons();
        });

        // Add download button event listeners
        this.elements.downloadPngBtn.addEventListener('click', () => this.downloadImage('png'));
        this.elements.downloadJpegBtn.addEventListener('click', () => this.downloadImage('jpeg'));
        this.elements.downloadSvgBtn.addEventListener('click', () => this.downloadImage('svg'));
    }

    enableDownloadButtons() {
        this.elements.downloadPngBtn.disabled = false;
        this.elements.downloadJpegBtn.disabled = false;
        this.elements.downloadSvgBtn.disabled = false;
    }

    disableDownloadButtons() {
        this.elements.downloadPngBtn.disabled = true;
        this.elements.downloadJpegBtn.disabled = true;
        this.elements.downloadSvgBtn.disabled = true;
    }

    async downloadImage(format) {
        const img = this.elements.generatedImage;
        if (!img.src) return;

        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // Draw the image on canvas
            ctx.drawImage(img, 0, 0);

            let dataUrl;
            let fileName;

            switch (format) {
                case 'png':
                    dataUrl = canvas.toDataURL('image/png');
                    fileName = 'generated-image.png';
                    break;
                case 'jpeg':
                    dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                    fileName = 'generated-image.jpg';
                    break;
                case 'svg':
                    // For SVG, we'll create a simple SVG with the image as a foreign object
                    const svgData = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                            <foreignObject width="100%" height="100%">
                                <div xmlns="http://www.w3.org/1999/xhtml">
                                    <img src="${canvas.toDataURL('image/png')}" width="100%" height="100%"/>
                                </div>
                            </foreignObject>
                        </svg>
                    `;
                    dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
                    fileName = 'generated-image.svg';
                    break;
            }

            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading image:', error);
            this.updateStatus('Failed to download image', true);
        }
    }

    updateRecordButton(isRecording) {
        const button = this.elements.recordButton;
        if (isRecording) {
            button.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
            button.classList.add('recording');
        } else {
            button.innerHTML = '<i class="fas fa-microphone"></i> Record';
            button.classList.remove('recording');
        }
    }

    showLoading() {
        this.elements.loadingSpinner.classList.add('visible');
        this.elements.generatedImage.classList.remove('visible');
        this.disableDownloadButtons();
    }

    hideLoading() {
        this.elements.loadingSpinner.classList.remove('visible');
    }

    updateStatus(message, isError = false) {
        const statusDiv = this.elements.statusDiv;
        statusDiv.textContent = message;
        statusDiv.style.color = isError ? '#dc2626' : '#ffffff';
        
        statusDiv.style.animation = 'none';
        statusDiv.offsetHeight; // Trigger reflow
        statusDiv.style.animation = 'fadeIn 0.3s ease-out';
    }

    updateTranscription(text) {
        if (text) {
            this.elements.transcriptionDiv.textContent = `Transcribed: ${text}`;
            this.elements.transcriptionDiv.style.animation = 'fadeIn 0.3s ease-out';
        }
    }

    updateImage(imageBase64) {
        this.elements.generatedImage.src = `data:image/png;base64,${imageBase64}`;
    }

    clearInput() {
        this.elements.textInput.value = '';
    }

    getInputText() {
        return this.elements.textInput.value.trim();
    }

    validateInput() {
        const text = this.getInputText();
        if (!text) {
            this.updateStatus('Please enter a description', true);
            this.elements.textInput.classList.add('shake');
            setTimeout(() => this.elements.textInput.classList.remove('shake'), config.UI.ANIMATIONS.SHAKE_DURATION);
            return false;
        }
        return true;
    }

    updateChatHistory(text, imageBase64) {
        const chatEntry = document.createElement('div');
        chatEntry.className = 'chat-entry';
        chatEntry.innerHTML = `
            <p><strong>Input:</strong> ${text}</p>
            <img src="data:image/png;base64,${imageBase64}" 
                 alt="Generated Image" 
                 style="max-width: 100%; border-radius: 8px; margin-top: 10px;">
        `;
        
        chatEntry.style.opacity = '0';
        this.elements.chatHistory.insertBefore(chatEntry, this.elements.chatHistory.firstChild);
        
        setTimeout(() => {
            chatEntry.style.opacity = '1';
            chatEntry.style.transform = 'translateX(0)';
        }, 10);
    }

    clearHistory() {
        while (this.elements.chatHistory.firstChild) {
            this.elements.chatHistory.removeChild(this.elements.chatHistory.firstChild);
        }
        this.updateStatus('History cleared!');
    }

    setButtonState(button, enabled) {
        this.elements[button].disabled = !enabled;
    }
} 