import * as api from '../api';

// export const signin = (formData, navigate) => async (dispatch) => {
//     try {
//         const{data} = await api.signIn(formData);
//         dispatch({type: 'AUTH', data})
//         navigate('/');
//     } catch (error) {
//         console.log(error);
//     }
// }

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        console.log(formData);
        console.log("yahan tak aagya tha");
        const{data} = await api.signUp(formData);
        dispatch({type: 'AUTH', data})
        navigate('/');
    } catch (error) {
        console.log(error);
    }
}