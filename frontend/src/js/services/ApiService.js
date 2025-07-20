import { config } from '../constants/config.js';

export class ApiService {
    constructor() {
        this.apiUrl = config.API_URL;
    }

    async generateImage(prompt) {
        try {
            const response = await fetch(`${this.apiUrl}/transcribe`, {  // Note: Using /transcribe endpoint for both text and audio
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: prompt })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.image) {
                throw new Error('No image data received from server');
            }

            // Convert base64 to data URL
            return `data:image/png;base64,${data.image}`;
        } catch (error) {
            console.error('API error:', error);
            throw new Error(`Failed to generate image: ${error.message}`);
        }
    }

    async transcribeAudio(audioData) {
        if (!audioData) {
            throw new Error('No audio data provided');
        }

        try {
            const response = await fetch(`${this.apiUrl}/transcribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audio: audioData,
                    filename: 'recorded_audio.mp3'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.text) {
                throw new Error('No transcription received from server');
            }

            return data.text;
        } catch (error) {
            console.error('API error:', error);
            throw new Error(`Failed to transcribe audio: ${error.message}`);
        }
    }

    async removeBackground(imageUrl) {
        try {
            const response = await fetch(`${this.apiUrl}/remove-background`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.processedImageUrl) {
                throw new Error('No processed image URL received from server');
            }

            return data.processedImageUrl;
        } catch (error) {
            console.error('API error:', error);
            throw new Error(`Failed to remove background: ${error.message}`);
        }
    }
} 