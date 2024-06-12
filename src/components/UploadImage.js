import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const UploadImage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file);

    try {
        setUploading(true);
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('No JWT found. Please log in.');
        }
        const response = await fetch('http://localhost:6002/post', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
          },
          body: formData,
        });
      
        if (!response.ok) {
          throw new Error('Failed to upload file.');
        }
        
        setMessage('File uploaded successfully!');
        navigate('/home');
      } catch (error) {
        setMessage('Failed to upload file.');
      } finally {
        setUploading(false);
      }
      
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Upload Image</h1>
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Content
            </label>
            <textarea
                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Upload File
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 mt-4 font-medium text-white rounded-lg shadow-lg ${
              uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {message && (
            <div className={`mt-4 text-sm text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadImage;
