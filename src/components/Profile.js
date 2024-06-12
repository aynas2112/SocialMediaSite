import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { gql, useQuery } from "@apollo/client";

const GET_PROFILE = gql`
  query GetProfile($getProfileId: String!) {
    getProfile(id: $getProfileId) {
      username
      bio
      profileImageUrl
      followers
      following
    }
  }
`;

const ProfilePage = () => {
  const token = localStorage.getItem("jwt");
  const decoded = jwtDecode(token);
  const { user_id } = decoded;

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { getProfileId: user_id },
  });
  useEffect(() => {
    if (data) {
      const { username, bio, profileImageUrl, followers, following } =
        data.getProfile;
      setUsername(username);
      setBio(bio);
      setProfileImageUrl(profileImageUrl);
      setFollowers(followers);
      setFollowing(following);
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const posts = new Array(9).fill({
    imageUrl: "https://via.placeholder.com/150", // Placeholder image URL
    altText: "Post Image",
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Unigram</h1>
          <nav>
            <a href="/profile/edit" className="mr-4">
              Edit Profile
            </a>
            <a href="/feed">Feed</a>
          </nav>
        </div>
      </header>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto p-4 bg-white mt-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold">{username}</h2>
            <div className="flex mt-2">
              <div className="mr-4">
                <span className="font-semibold">10</span> posts
              </div>
              <div className="mr-4">
                <span className="font-semibold">{followers.length}</span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold">{following.length}</span>{" "}
                following
              </div>
            </div>
            <p className="mt-2">
              <b>Bio: </b>
              {bio}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto p-4 mt-4 grid grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="w-full bg-gray-200 rounded-lg overflow-hidden"
          >
            <img
              src={post.imageUrl}
              alt={post.altText}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
