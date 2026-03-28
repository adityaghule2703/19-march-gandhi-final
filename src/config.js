import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
  //baseURL: import.meta.env.VITE_API_BASE_URL
      //  baseURL: 'http://localhost:3004/api/v1'

            // baseURL:'https://gandhitvs.in/dealership/api/v1'
        //  baseURL:'http://192.168.1.8:3009/api/v1' 
  
           baseURL:'https://gmplmis.com/dealership-api/api/v1'
        //  baseURL:'https://sgm.gmplmis.com/api-dealership/api/v1'  
};

export default config;
