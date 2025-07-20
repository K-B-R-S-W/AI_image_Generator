import { config } from '../constants/config.js';

export class AudioService {
    constructor() {
        this.mediaRecorder = null;
        this.audioStream = null;
        this.audioChunks = [];
        this.mp3Encoder = null;
        this.isRecording = false;
    }

    async startRecording() {
        try {
            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioChunks = [];
            this.mp3Encoder = new lamejs.Mp3Encoder(
                config.AUDIO.CHANNELS,
                config.AUDIO.SAMPLE_RATE,
                config.AUDIO.BIT_RATE
            );
            
            this.mediaRecorder = new MediaRecorder(this.audioStream);
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            
            return true;
        } catch (err) {
            console.error('Recording error:', err);
            throw new Error(`Failed to start recording: ${err.message}`);
        }
    }

    async stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            return new Promise((resolve) => {
                this.mediaRecorder.onstop = () => {
                    this.audioStream.getTracks().forEach(track => track.stop());
                    this.isRecording = false;
                    resolve();
                };
                this.mediaRecorder.stop();
            });
        }
    }

    async processAudio() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const arrayBuffer = await this.blobToArrayBuffer(audioBlob);
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const samples = audioBuffer.getChannelData(0);
            const mp3Buffer = this.encodeMP3(samples);
            
            return btoa(String.fromCharCode.apply(null, new Uint8Array(mp3Buffer)));
        } catch (error) {
            console.error('Audio processing error:', error);
            throw new Error(`Failed to process audio: ${error.message}`);
        }
    }

    blobToArrayBuffer(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    }

    encodeMP3(samples) {
        const sampleBlockSize = config.AUDIO.SAMPLE_BLOCK_SIZE;
        const mp3Buffers = [];
        
        for (let i = 0; i < samples.length; i += sampleBlockSize) {
            const sampleChunk = samples.subarray(i, i + sampleBlockSize);
            const int16Samples = new Int16Array(sampleChunk.length);
            
            for (let j = 0; j < sampleChunk.length; j++) {
                int16Samples[j] = sampleChunk[j] < 0 
                    ? sampleChunk[j] * 0x8000 
                    : sampleChunk[j] * 0x7FFF;
            }
            
            const mp3Chunk = this.mp3Encoder.encodeBuffer(int16Samples);
            if (mp3Chunk.length > 0) {
                mp3Buffers.push(mp3Chunk);
            }
        }
        
        const finalMp3Chunk = this.mp3Encoder.flush();
        if (finalMp3Chunk.length > 0) {
            mp3Buffers.push(finalMp3Chunk);
        }
        
        return mp3Buffers.reduce((acc, val) => {
            const tmp = new Uint8Array(acc.length + val.length);
            tmp.set(acc, 0);
            tmp.set(val, acc.length);
            return tmp;
        }, new Uint8Array(0));
    }
} 