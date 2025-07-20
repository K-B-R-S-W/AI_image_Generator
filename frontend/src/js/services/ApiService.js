import { config } from '../constants/config.js';

export class ApiService {
    static async generateFromText(text) {
        try {
            const response = await fetch(`${config.API_URL}/transcribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            throw new Error(`Failed to generate image: ${error.message}`);
        }
    }

    static async generateFromAudio(audioBase64) {
        try {
            const response = await fetch(`${config.API_URL}/transcribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audio: audioBase64,
                    filename: 'recorded_audio.mp3'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            throw new Error(`Failed to process audio: ${error.message}`);
        }
    }
} 