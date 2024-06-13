import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContexts';
import UploadPost from './UploadPost';
import AddFilters from './AddFilters';
import AddDetails from './AddDetails';

const CreatePost = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredImage, setFilteredImage] = useState(null); // Add state for filtered image

  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-[#2C2C2C] border border-[#8E44AD] rounded" style={{ height: '90vh' }}>
        {step === 1 && <UploadPost onNext={nextStep} onPrevious={prevStep} setImage={setImage} />}
        {step === 2 && <AddFilters onNext={nextStep} onPrevious={prevStep} image={image} setFilteredImage={setFilteredImage} />}
        {step === 3 && (
          <AddDetails
            onPrevious={prevStep}
            caption={caption}
            setCaption={setCaption}
            tags={tags}
            setTags={setTags}
            location={location}
            setLocation={setLocation}
            loading={loading}
            setLoading={setLoading}
            filteredImage={filteredImage}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePost;