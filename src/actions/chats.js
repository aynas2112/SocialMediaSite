import * as api from '../api';

export const getChats = ()=> async(dispatch)=>{
    try {
        const {data} = await api.fetchChats();
        dispatch({type: 'FETCH_ALL', payload: data});
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}
