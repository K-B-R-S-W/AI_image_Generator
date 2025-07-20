// Background Remover Page Module
import { ApiService } from '../services/ApiService.js';

export class BackgroundRemover {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'background-remover-page';
        this.createContent();
    }

    createContent() {
        this.container.innerHTML = `
            <div class="glass-card">
                <header class="header">
                    <h1 class="title">Background Remover <i class="fas fa-cut title-icon"></i></h1>
                    <p class="subtitle">Remove background from your images with AI</p>
                </header>

                <div class="upload-section">
                    <div class="upload-container">
                        <input type="file" id="imageUpload" accept="image/*" class="file-input" hidden>
                        <label for="imageUpload" class="upload-area">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Click to upload or drag and drop</span>
                            <span class="small">Supports: JPG, PNG</span>
                        </label>
                    </div>
                </div>

                <div class="image-preview-container">
                    <div class="preview-wrapper">
                        <div class="original-image">
                            <h3>Original Image</h3>
                            <img id="originalPreview" src="" alt="Original image preview">
                        </div>
                        <div class="processed-image">
                            <h3>Processed Image</h3>
                            <img id="processedPreview" src="" alt="Processed image preview">
                        </div>
                    </div>
                    <button id="removeBackground" class="btn process-btn" disabled>
                        <i class="fas fa-magic"></i>
                        Remove Background
                    </button>
                    <button id="downloadProcessed" class="btn download-btn" disabled>
                        <i class="fas fa-download"></i>
                        Download
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Initialize services
        this.apiService = new ApiService();

        // Get DOM elements
        const fileInput = this.container.querySelector('#imageUpload');
        const uploadArea = this.container.querySelector('.upload-area');
        const removeBtn = this.container.querySelector('#removeBackground');
        const downloadBtn = this.container.querySelector('#downloadProcessed');

        if (!fileInput || !uploadArea || !removeBtn || !downloadBtn) {
            console.error('Required elements not found in BackgroundRemover');
            return;
        }

        // Drag and drop handlers
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageUpload(file);
            }
        });

        // File input handler
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file);
            }
        });

        // Remove background button handler
        removeBtn.addEventListener('click', () => {
            this.processImage();
        });

        // Download button handler
        downloadBtn.addEventListener('click', () => {
            this.downloadImage();
        });
    }

    handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const originalPreview = this.container.querySelector('#originalPreview');
            originalPreview.src = e.target.result;
            originalPreview.style.display = 'block';
            
            const removeBtn = this.container.querySelector('#removeBackground');
            removeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    async processImage() {
        const originalPreview = this.container.querySelector('#originalPreview');
        const processedPreview = this.container.querySelector('#processedPreview');
        const removeBtn = this.container.querySelector('#removeBackground');
        const downloadBtn = this.container.querySelector('#downloadProcessed');

        try {
            removeBtn.disabled = true;
            removeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            const result = await this.apiService.removeBackground(originalPreview.src);
            processedPreview.src = result;
            processedPreview.style.display = 'block';
            downloadBtn.disabled = false;
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to remove background. Please try again.');
        } finally {
            removeBtn.disabled = false;
            removeBtn.innerHTML = '<i class="fas fa-magic"></i> Remove Background';
        }
    }

    downloadImage() {
        const processedImage = this.container.querySelector('#processedPreview');
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = processedImage.src;
        link.click();
    }

    getElement() {
        // Setup event listeners when the element is requested
        this.setupEventListeners();
        return this.container;
    }
} 