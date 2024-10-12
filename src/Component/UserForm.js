import React, { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from 'firebase/storage';
import { app } from '../Auth/Firebase';
import axios from 'axios';

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    social_media_handle: "",
    images: []
  });
  const [done, setDone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [btnDisabled, setBtnDisabled] = useState(false);



  // Handle Image Upload 
  const handleImageUpload = async (files) => {
    const storage = getStorage(app);
    const promises = [];
    const updatedProgress = { ...uploadProgress };
    setBtnDisabled(true);

    Array.from(files).forEach((file, index) => {
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      promises.push(
        new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              updatedProgress[file.name] = progress.toFixed(0);
              setUploadProgress({ ...updatedProgress });
            },
            (error) => {
              reject(error);
              setUploadError(`Failed to upload ${file.name}`);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setFormData((prevData) => ({
                ...prevData,
                images: [...prevData.images, downloadURL],
              }));
              setUploadSuccess("Images uploaded successfully!");
              resolve();
            }
          );
        })
      );
    });

    try {
      await Promise.all(promises);
      setUploadError(null);
      setBtnDisabled(false);
    } catch (error) {
      setUploadError('One or more images failed to upload.');
      console.error(error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection 
  const handleFileChange = (e) => {
    const files = e.target.files;
    handleImageUpload(files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnDisabled(true);

    try {
      const response = await axios.post(process.env.REACT_APP_API_END, formData);
      console.log("Form data submitted successfully:", response.data);
      setDone(true)
    } catch (error) {
      console.error("Error submitting form data:", error);
      setBtnDisabled(false);
    }
  };

  return (

    <div className="flex items-center mt-4 flex-col min-h-screen bg-gray-100">


      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Submit Your Details</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Social Media Handle Input */}
        <div className="mb-4">
          <label htmlFor="social_media_handle" className="block text-sm font-medium text-gray-700 mb-1">
            Social Media Handle
          </label>
          <input
            type="text"
            id="social_media_handle"
            name="social_media_handle"
            value={formData.social_media_handle}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>


        {Object.keys(uploadProgress).map((fileName) => (
          <div key={fileName} className="mb-4">
            <p>{fileName}: {uploadProgress[fileName]}%</p>
            {uploadProgress[fileName] < 100 && <div className="bg-gray-200 h-2 rounded-lg">
              <div className="bg-blue-500 h-2 rounded-lg" style={{ width: `${uploadProgress[fileName]}%` }}></div>
            </div>}
          </div>
        ))}

        {uploadError && <p className="text-red-500">{uploadError}</p>}
        {uploadSuccess && <p className="text-green-500">{uploadSuccess}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={btnDisabled}
        >
          { done ? "Submitted Successfully" : "Submit" }
        </button>
      </form>

    </div>
  );
};

export default UserForm;
