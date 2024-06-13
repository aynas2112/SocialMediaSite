import React from 'react';
import PlacesAutocomplete from './PlacesAutocomplete';

const AddDetails = ({
  onPrevious,
  caption,
  setCaption,
  tags,
  setTags,
  location,
  setLocation,
  loading,
  setLoading,
  filteredImage,
}) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Handle the submission logic here
    setLoading(false);
  };

  console.log("Filtered Image:", filteredImage); // Add this console log for debugging

  return (
    <div className="p-4">
      <button onClick={onPrevious} className="text-[#F1C40F] p-2 rounded mb-4">
        <i className="ti ti-chevron-left"></i>
      </button>
      <h2 className="text-center mb-8 text-[#8E44AD] text-2xl font-semibold">Add Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {filteredImage && (
          <div className="flex justify-center mb-4">
            <img
              src={filteredImage}
              alt="Filtered Image"
              className="rounded-lg shadow-lg"
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </div>
        )}
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value.split(','))}
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
        />
        <PlacesAutocomplete setLocation={setLocation} />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded font-semibold hover:bg-[#7D3C98] transition-colors duration-300"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default AddDetails;
