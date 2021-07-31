import axios from "axios";


const baseURL = process.env.REACT_APP_API_URL;

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})


const fetchTrending = async () => {
    try{
        let trends = null;
        let response = await client.get('/inventory/api/v1/products/get_latest_three_items/');
        if (response) trends = response.data;
        console.log(trends);
        return trends;
    } catch(error){
        console.log(error.response);
    }
}


export const trendsAPI = {
    fetchTrending
}
