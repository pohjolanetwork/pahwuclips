document.addEventListener('DOMContentLoaded', () => {
    function loadVideos() {
        fetch('/videos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(videos => {
                const videoListContainer = document.getElementById('videoList');
                videoListContainer.innerHTML = '';

                if (videos.length === 0) {
                    videoListContainer.innerHTML = '<p>No videos available.</p>';
                    return;
                }

                videos.forEach(video => {
                    const videoItem = document.createElement('div');
                    videoItem.className = 'video-item';

                    // Create and style the video element
                    const videoElement = document.createElement('video');
                    videoElement.controls = true;
                    videoElement.src = `/videos/${video.name}`;
                    videoElement.width = 320; // Set a default width
                    videoElement.height = 240; // Set a default height

                    // Add a fallback if the video does not play
                    videoElement.onerror = () => {
                        alert(`Error loading video: ${video.name}`);
                    };

                    // Create and style the video info element
                    const videoInfo = document.createElement('div');
                    videoInfo.className = 'video-info';
                    videoInfo.innerHTML = `<p>Filename: ${video.name}</p><p>Format: ${video.format}</p>`;

                    // Create and style the delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    deleteButton.innerText = 'Delete';
                    deleteButton.onclick = () => {
                        const confirmed = confirm(`Are you sure you want to delete the video "${video.name}"?`);
                        if (confirmed) {
                            fetch(`/videos/${video.name}`, {
                                method: 'DELETE'
                            })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message);
                                loadVideos(); // Reload video list after deletion
                            })
                            .catch(error => {
                                console.error('Delete error:', error);
                                alert('Failed to delete video');
                            });
                        }
                    };

                    // Append video, info, and delete button to the video item
                    videoItem.appendChild(videoElement);
                    videoItem.appendChild(videoInfo);
                    videoItem.appendChild(deleteButton);

                    // Append the video item to the video list container
                    videoListContainer.appendChild(videoItem);
                });
            })
            .catch(error => {
                console.error('Error fetching video list:', error);
                const videoListContainer = document.getElementById('videoList');
                videoListContainer.innerHTML = '<p>Failed to load videos.</p>';
            });
    }

    // Initial load of videos
    loadVideos();
});
