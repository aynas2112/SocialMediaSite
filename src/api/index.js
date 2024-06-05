// import axios from 'axios';

// const API = axios.create({ baseURL: ' http://localhost:6000/' });

// API.interceptors.request.use((req)=> {
//     if (localStorage.getItem('profile')) {
//         const user = JSON.parse(localStorage.getItem('profile'));
//         if (user?.token) {
//             req.headers.Authorization = `Bearer ${user.token}`;
//         }
//         else {
//             req.headers.Authorization = `Bearer ${user.credential}`;
//         }
//     }
//     return req;
// });

// export const fetchChats = () => API.get('/chats');

// // export const createPost = (newPost)=> API.post('/posts/new', newPost);
// // export const updatePost = (id, updatedPost)=> API.patch(`/posts/${id}`, updatedPost);
// // export const deletePost = (id,post)=> API.delete(`/posts/${id}`, post);
// // export const likePost = (id)=> API.patch(`/posts/${id}/likePost`);



// // export const signIn = (formData) => API.post('/users/signin', formData);
// export const signUp = (formData) => API.post('/user/test', formData);