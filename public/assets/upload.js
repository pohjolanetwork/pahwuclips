document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const progressText = document.getElementById('progressText');
    const progressArea = document.querySelector('.progress-area');
    const uploadedArea = document.querySelector('.uploaded-area');

    uploadButton.addEventListener('click', () => {
        fileInput.click(); // Trigger file input click to open file explorer
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        if (files.length === 0) {
            alert('No files selected.');
            return;
        }

        // Show progress bar and text
        progressContainer.style.display = 'block';
        progressText.style.display = 'block';

        // Handle each file upload
        [...files].forEach(file => {
            uploadFile(file);
        });
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);

        // Update progress bar as upload progresses
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `Uploading ${Math.round(percentComplete)}%...`;
            }
        };

        // On upload complete
        xhr.onload = function() {
            if (xhr.status === 200) {
                progressBar.style.width = '100%';
                progressText.textContent = 'Upload complete!';
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    window.location.href = '/'; // Redirect to the homepage (index.html)
                }, 2000); // Delay for the user to see the complete message
            } else {
                progressText.textContent = 'Upload failed.';
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                }, 2000); // Delay for error message
            }
        };

        // When Upload Fails
        xhr.onerror = function() {
            progressText.textContent = 'An error occurred while uploading the files.';
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 2000); // Delay for error message
        };

        xhr.send(formData);
    }

    function updateProgress(fileName, percent, status = 'Uploading') {
        let progressRow = document.querySelector(`.progress-area .row[data-file="${fileName}"]`);
        if (!progressRow) {
            progressRow = document.createElement('div');
            progressRow.className = 'row';
            progressRow.dataset.file = fileName;
            progressRow.innerHTML = `
                <i class="fas fa-file-upload"></i>
                <div class="details">
                    <span>${fileName}</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${percent}%"></div>
                    </div>
                    <span>${status}</span>
                </div>
            `;
            progressArea.appendChild(progressRow);
        } else {
            const progressBar = progressRow.querySelector('.progress-bar .progress');
            progressBar.style.width = `${percent}%`;
            progressRow.querySelector('span:last-of-type').textContent = status;
        }
    }
});
