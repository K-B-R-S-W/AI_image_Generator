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
            clearHistoryBtn: document.getElementById('clearHistoryBtn')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.generatedImage.addEventListener('load', () => {
            this.hideLoading();
            this.elements.generatedImage.classList.add('visible');
        });
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
    }

    hideLoading() {
        this.elements.loadingSpinner.classList.remove('visible');
    }

    updateStatus(message, isError = false) {
        const statusDiv = this.elements.statusDiv;
        statusDiv.textContent = message;
        statusDiv.style.color = isError ? '#dc2626' : '#666';
        
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