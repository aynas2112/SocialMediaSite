import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AddFilters = ({ onNext, onPrevious, image, setFilteredImage }) => {
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (image && image instanceof Blob) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      setFilteredImage(url); // Update filteredImage state in CreatePost
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [image, setFilteredImage]);

  const handleFilterChange = (filterName) => {
    setSelectedFilter(filterName);
    applyFilter(filterName);
  };

  const applyFilter = (filterName) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = getFilterStyle(filterName);
      ctx.drawImage(img, 0, 0);
      const filteredUrl = canvas.toDataURL();
      setFilteredImage(filteredUrl); // Update filteredImage state in CreatePost with filtered image
    };
  };

  const getFilterStyle = (filterName) => {
    switch (filterName) {
      case 'grayscale':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(100%)';
      case 'invert':
        return 'invert(100%)';
      case 'hue-rotate':
        return 'hue-rotate(90deg)';
      case 'saturate':
        return 'saturate(200%)';
      case 'contrast':
        return 'contrast(200%)';
      case 'brightness':
        return 'brightness(150%)';
      case 'tint':
        return 'sepia(50%)';
      case 'duotone':
        return 'saturate(80%) sepia(20%)';
      default:
        return 'none';
    }
  };

  const sliderSettings = {
    dots: true,
    // infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    centerMode: true,
    centerPadding: '0px',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-4">
        <button onClick={onPrevious} className="text-[#F1C40F] p-2 rounded">
          <i className="ti ti-chevron-left"></i>
        </button>
        <button onClick={onNext} className="text-[#F1C40F] p-2 rounded">
          <i className="ti ti-chevron-right"></i>
        </button>
      </div>
      <h2 className="text-center mb-8 text-[#8E44AD]">Add Filters</h2>
      <div className="mb-4 w-[40%]" style={{ height: '35vh' }}>
        {imageUrl && (
          <img
            src={imageUrl}
            style={{ filter: getFilterStyle(selectedFilter), width: '100%', height: '100%', objectFit: 'contain' }}
            alt="Filtered"
          />
        )}
      </div>
      <Slider {...sliderSettings} className="w-full">
        {['none', 'grayscale', 'sepia', 'invert', 'hue-rotate', 'saturate', 'contrast', 'brightness', 'tint', 'duotone'].map((filterName) => (
          <div key={filterName} className="px-1 flex flex-col items-center">
            <div
              onClick={() => handleFilterChange(filterName)}
              className="cursor-pointer"
              style={{ margin: '2px' }} // Adjust margin here to decrease space between buttons
            >
              <div className="w-16 h-16 mb-1">
                <img
                  src={imageUrl}
                  style={{ filter: getFilterStyle(filterName), width: '100%', height: '100%', objectFit: 'cover' }}
                  alt={filterName}
                  className="rounded"
                />
              </div>
              <span className="text-center text-[#F1C40F] text-sm">{filterName === 'none' ? 'None' : filterName.charAt(0).toUpperCase() + filterName.slice(1)}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AddFilters;
