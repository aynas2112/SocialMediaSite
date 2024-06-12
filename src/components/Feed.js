import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaSearch,
  FaPlusSquare,
  FaHeart,
  FaUserCircle,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const MainFeed = () => {
  const token = localStorage.getItem("jwt");
  const decoded = jwtDecode(token);
  const { user_id } = decoded;
  const [followingDetails, setFollowingDetails] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:6001/user/feed`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data.data);
        setFollowingDetails(data.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchPost();
  }, []);

  const posts = followingDetails.flatMap(detail => 
    detail.posts.map(post => ({
      ...post,
      f_name: detail.f_name,
      profile_picture_url: detail.profile_picture_url
    }))
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Navigation bar */}
      <nav className="bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-10 flex justify-between p-4">
        <div className="font-bold text-xl">Unigram</div>
        <div className="flex space-x-4">
          <FaHome className="w-6 h-6" />
          <FaSearch className="w-6 h-6" />
          <FaPlusSquare className="w-6 h-6" />
          <FaHeart className="w-6 h-6" />
          <FaUserCircle className="w-6 h-6" />
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 mt-16 p-4">
        {/* Stories */}
        <div className="flex space-x-4 overflow-x-scroll pb-4">
          
          {followingDetails.map((detail) => (
            <div key={detail.id} className="flex flex-col items-center">
              <img
                src={detail.profile_picture_url}
                alt={detail.f_name}
                className="w-16 h-16 rounded-full border-2 border-red-500"
              />
              <span className="text-sm mt-2">{detail.f_name}</span>
            </div>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-8">
      {posts.map(post => (
        <div key={post.post_id} className="bg-gray-800 p-4 rounded-md shadow-md">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={post.profile_picture_url || "https://via.placeholder.com/40"}
              alt={post.f_name}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-bold">{post.f_name}</span>
          </div>
          {post.image_url && (
            <img src={post.image_url} alt="Post" className="w-full rounded-md" />
          )}
          <p className="mt-4">
            <span className="font-bold">{post.f_name} </span>
            {post.content}
          </p>
          <p className="text-sm text-gray-400 mt-2">{new Date(post.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-gray-800 shadow-md fixed bottom-0 left-0 right-0 z-10 flex justify-around p-4">
        <FaHome className="w-6 h-6" />
        <FaSearch className="w-6 h-6" />
        <FaPlusSquare className="w-6 h-6" />
        <FaHeart className="w-6 h-6" />
        <FaUserCircle className="w-6 h-6" />
      </nav>
    </div>
  );
};

export default MainFeed;