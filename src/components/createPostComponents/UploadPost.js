import React, { useState, useEffect } from 'react';

const UploadPost = ({ onNext, onPrevious, setImage }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [videoRef, setVideoRef] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(selectedFile);
      if (showCamera) {
        closeCamera();
      }
    }
  };

  const handleCaptureImage = async () => {
    try {
      const imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);
      const blob = await imageCapture.takePhoto();
      const capturedFile = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      setFile(capturedFile);
      setImage(capturedFile);
      const previewUrl = URL.createObjectURL(capturedFile);
      setPreview(previewUrl);
      closeCamera();
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      setShowCamera(true);
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };

  const closeCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      setShowCamera(false);
    }
  };

  useEffect(() => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    } else {
      setRecentFiles([
        { name: 'Image 1', url: 'default-image-url-1' },
        { name: 'Image 2', url: 'default-image-url-2' },
        { name: 'Image 3', url: 'default-image-url-3' },
      ]);
      setPreview('default-image-url-1');
    }
  }, [file]);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaStream]);

  useEffect(() => {
    if (videoRef && mediaStream) {
      videoRef.srcObject = mediaStream;
    }
  }, [videoRef, mediaStream]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center mb-8 w-full">
        <button className="text-[#F1C40F] p-2 rounded" onClick={onPrevious}><i className="ti ti-chevron-left"></i></button>
        <h2 className="text-center text-[#8E44AD]">Upload Image or Video</h2>
        <button className="text-[#F1C40F] p-2 rounded" onClick={onNext} disabled={!file}><i className="ti ti-chevron-right"></i></button>
      </div>
      <div className="mb-4 w-full">
        {showCamera ? (
          <video
            ref={(ref) => setVideoRef(ref)}
            autoPlay
            playsInline
            className="w-full"
            style={{ maxWidth: '100%', height: '40vh', objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full flex justify-center mb-4" style={{ height: '40vh' }}>
            {file && file.type.startsWith('video/') ? (
              <video controls className="max-w-full h-full object-contain">
                <source src={preview} type={file.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={preview} alt="Preview" className="max-w-full h-full object-contain rounded" />
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center mb-4">
        {!showCamera && !file && (
          <div className="flex items-center">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="bg-[#8E44AD] text-[#F1C40F] text-4xl p-2 rounded-full cursor-pointer mr-2">
              <i className="ti ti-photo-plus"></i>
            </label>
          </div>
        )}
        <button className="bg-[#8E44AD] text-[#F1C40F] text-4xl p-2 rounded-full" onClick={openCamera}><i className="ti ti-camera"></i></button>
      </div>
      {showCamera ? (
        <div className="mb-4 w-full flex justify-center">
          <button className="bg-[#8E44AD] text-[#F1C40F] text-4xl p-2 rounded-full" onClick={handleCaptureImage}><i className="ti ti-capture"></i></button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 w-full">
          {recentFiles.map((file, index) => (
            <img
              key={index}
              src={file.url}
              alt={file.name}
              className="w-full h-auto rounded cursor-pointer"
              onClick={() => {
                setFile(null);
                setPreview(file.url);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadPost;
