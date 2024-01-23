import axios from "axios";
import store from "../store/store";

const api = axios.create({
  baseURL: 'http://localhost:3600',
  headers: {
    "Content-Type": "application/json",
  }    
});

// Fungsi untuk mengatur token dalam header permintaan Axios
api.interceptors.request.use(async function (config) {

  // Ambil token dari store sesuai kebutuhan
  const token = store.getState().authSlice.token;

  if (token) {
    config.headers["Authorization"] = token;
  }

  // Periksa apakah permintaan mengandung file
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  
  return config;

}, function (error) {

  return Promise.reject(error);

});

// Tambahkan interceptor respons
api.interceptors.response.use(function (response) {
  
  console.log('response interceptors:', response)
  return response

}, function (error) {

  // if (error.response.status === 403 || error) {
  //   // window.location.pathname = '/'
  // }
  console.log("error interceptors new:", error)

  return Promise.reject(error);

});

export default api;
