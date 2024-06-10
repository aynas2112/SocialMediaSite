// EditProfile.js
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { gql, useQuery } from "@apollo/client";

const GET_PROFILE = gql`
  query GetProfile($getProfileId: String!) {
    getProfile(id: $getProfileId) {
      username
      fname
      bio
      profileImageUrl
    }
  }
`;

const EditProfile = () => {
  const token = localStorage.getItem("jwt");
  const decoded = jwtDecode(token);
  const { user_id} = decoded;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("halo");
  const [picture, setPicture] = useState(decoded.picture);
  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { getProfileId: user_id },
  });
  useEffect(() => {
    if (data) {
      const { username, fname, bio, profileImageUrl } = data.getProfile;
      setUsername(username);
      setName(fname);
      setBio(bio || "halo");
      setPicture(profileImageUrl || picture);
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleFileChange = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    const response = await fetch("http://localhost:6001/user/profile/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Include the JWT in the Authorization header
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload file.");
    } else {
      console.log("done");
    }
    setPicture(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      username,
      name,
      bio,
    };
    try {
      const response = await fetch(
        "http://localhost:6001/user/profile/update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }
      console.log(response);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white py-5">
      <div className="flex justify-between items-center px-4">
        <a className="text-sm text-blue-500" href="/profile">
          <i className="ri-arrow-left-s-line"></i> profile
        </a>
        <h2 className="leading-none text-sm">Edit Profile</h2>
        <a className="text-sm" href="/feed">
          <i className="ri-home-line"></i> home
        </a>
      </div>
      <div className="flex flex-col items-center gap-2 mt-20">
        <div className="image w-20 h-20 bg-sky-100 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={`${picture}`}
            alt=""
          />
        </div>
        <button
          id="editbtn"
          className="text-blue-500 capitalize"
          onClick={() => document.querySelector("#file").click()}
        >
          edit picture
        </button>
      </div>
      <div className="gap-5 px-4 mt-10">
        <h3 className="text-lg leading-none">Edit Account Details</h3>
        <hr className="opacity-30 my-3" />
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
            type="text"
            placeholder="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900"
            type="text"
            placeholder="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="px-3 mt-2 py-2 border-2 border-zinc-800 rounded-md block w-full bg-zinc-900 resize-none"
            placeholder="Bio"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            className="w-full bg-blue-500 px-3 py-3 rounded-md mt-2"
            type="submit"
            value="Update Details"
          />
        </form>
      </div>
      <form hidden id="fileform" method="post" enctype="multipart/form-data">
        <input id="file" type="file" name="image" onChange={handleFileChange} />
      </form>
    </div>
  );
};

export default EditProfile;
