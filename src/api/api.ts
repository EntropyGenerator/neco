import axios from 'axios';

export const api = axios.create({
    baseURL: '/necore',
    timeout: 10000
})

const authorized = () => {
  return !(localStorage.getItem('token') == '')
}

api.interceptors.request.use(
  (config) => {
    if (authorized()) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)