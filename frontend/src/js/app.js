import { AudioService } from './services/AudioService.js';
import { ApiService } from './services/ApiService.js';
import { UIService } from './services/UIService.js';

class App {
    constructor() {
        this.audioService = new AudioService();
        this.uiService = new UIService();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Text generation
        this.uiService.elements.sendTextButton.addEventListener('click', () => this.handleTextGeneration());
        this.uiService.elements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleTextGeneration();
        });

        // Audio recording
        this.uiService.elements.recordButton.addEventListener('click', () => this.handleRecording());

        // Clear history
        this.uiService.elements.clearHistoryBtn.addEventListener('click', () => this.uiService.clearHistory());
    }

    async handleTextGeneration() {
        if (!this.uiService.validateInput()) return;

        const text = this.uiService.getInputText();
        this.uiService.showLoading();
        this.uiService.updateStatus('Generating image...');
        this.uiService.setButtonState('sendTextButton', false);

        try {
            const data = await ApiService.generateFromText(text);
            
            if (data.image) {
                this.uiService.updateImage(data.image);
                this.uiService.updateChatHistory(text, data.image);
                this.uiService.clearInput();
                this.uiService.updateStatus('Image Generated Successfully!');
            } else {
                throw new Error(data.error || 'Failed to generate image');
            }
        } catch (error) {
            this.uiService.updateStatus(error.message, true);
            this.uiService.hideLoading();
        } finally {
            this.uiService.setButtonState('sendTextButton', true);
        }
    }

    async handleRecording() {
        if (this.audioService.isRecording) {
            await this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            await this.audioService.startRecording();
            this.uiService.updateRecordButton(true);
            this.uiService.updateStatus('Recording...');
        } catch (error) {
            this.uiService.updateStatus(error.message, true);
        }
    }

    async stopRecording() {
        try {
            await this.audioService.stopRecording();
            this.uiService.updateRecordButton(false);
            this.uiService.updateStatus('Processing audio...');
            this.uiService.showLoading();

            const audioBase64 = await this.audioService.processAudio();
            const data = await ApiService.generateFromAudio(audioBase64);

            if (data.image) {
                this.uiService.updateImage(data.image);
                this.uiService.updateTranscription(data.text);
                this.uiService.updateChatHistory(data.text || 'Audio Input', data.image);
                this.uiService.updateStatus('Image Generated Successfully!');
            } else {
                throw new Error(data.error || 'Failed to generate image');
            }
        } catch (error) {
            this.uiService.updateStatus(error.message, true);
            this.uiService.hideLoading();
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 