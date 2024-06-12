import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaSearch,
  FaPlusSquare,
  FaHeart,
  FaUserCircle,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { gql, useQuery } from "@apollo/client";

const stories = [
  { id: 1, name: "John", img: "https://via.placeholder.com/50" },
  { id: 2, name: "Jane", img: "https://via.placeholder.com/50" },
  { id: 3, name: "Mike", img: "https://via.placeholder.com/50" },
  { id: 4, name: "Alice", img: "https://via.placeholder.com/50" },
  { id: 4, name: "Alice", img: "https://via.placeholder.com/50" },
];

const posts = [
  {
    id: 1,
    username: "john_doe",
    img: "https://via.placeholder.com/500",
    caption: "Beautiful view!",
  },
  {
    id: 2,
    username: "jane_smith",
    img: "https://via.placeholder.com/500",
    caption: "Loving the vibes!",
  },
];

const GET_FOLLOWING = gql`
  query GetProfile($getProfileId: String!) {
    getProfile(id: $getProfileId) {
      following
    }
  }
`;

const GET_STORIES = gql`
  query GetProfile($getProfileId: String!) {
    getProfile(id: $getProfileId) {
      fname
      profileImageUrl
    }
  }
`;

const MainFeed = () => {
  const token = localStorage.getItem("jwt");
  const decoded = jwtDecode(token);
  const { user_id } = decoded;
  const [followingDetails, setFollowingDetails] = useState([]);

  const { loading, error, data } = useQuery(GET_FOLLOWING, {
    variables: { getProfileId: user_id },
  });

  useEffect(() => {
    if (data && data.getProfile.following.length > 0) {
      const fetchFollowingDetails = async () => {
        const promises = data.getProfile.following.map(async (id) => {
          const { data } = await client.query({
            query: GET_STORIES,
            variables: { getProfileId: id },
          });
          return data.getProfile;
        });

        const details = await Promise.all(promises);
        setFollowingDetails(details);
      };

      fetchFollowingDetails();
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


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
          {followingDetails.map((story) => (
            <div key={story.id} className="flex flex-col items-center">
              <img
                src={story.profileImageUrl}
                alt={story.fname}
                className="w-16 h-16 rounded-full border-2 border-red-500"
              />
              <span className="text-sm mt-2">{story.name}</span>
            </div>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-800 p-4 rounded-md shadow-md">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt={post.username}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-bold">{post.username}</span>
              </div>
              <img src={post.img} alt="Post" className="w-full rounded-md" />
              <p className="mt-4">
                <span className="font-bold">{post.username} </span>
                {post.caption}
              </p>
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
