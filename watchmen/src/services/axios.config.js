import axios from "axios";
import { setProgressBar } from "../redux/actions";
import { store } from "../redux/configureStore";


axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.onDownloadProgress = (progressEvent) => {
    console.log(progressEvent);
    let data = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
    store.dispatch(setProgressBar(data));
}

export default axios;
