import React,{useState} from 'react'

const FinalPage = () => {
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState([]);
    const [location, setLocation] = useState('');
    useEffect(() => {
        if (image && image instanceof Blob) {
          const imageUrl = URL.createObjectURL(image);
          setFilteredImage(imageUrl);
          return () => {
            URL.revokeObjectURL(imageUrl);
          };
        }
      }, [image]);
  return (
    <div>FinalPage</div>
  )
}

export default FinalPage