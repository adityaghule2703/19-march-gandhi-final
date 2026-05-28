import axios from 'axios';

axios.defaults.withCredentials = true;
const config = {
  //baseURL: import.meta.env.VITE_API_BASE_URL
      //  baseURL: 'http://localhost:3004/api/v1'

            baseURL:'https://gandhitvs.in/dealership/api/v1'

            // baseURL : "http://169.254.8.222:3009/api/v1"

            // baseURL : "http://192.168.241.181:3009/api/v1"

            // baseURL : "http://192.168.241.113:3009/api/v1"

            // baseURL : "http://10.102.253.113:3009/api/v1"
  
        //  baseURL:'http://192.168.1.8:3009/api/v1' 
  
        //    baseURL:'https://gmplmis.com/dealership-api/api/v1'
        // baseURL : 'http://192.168.1.8:3009/api/v1'
        //    baseURL : 'http://192.168.1.11:3009/api/v1'
            //  baseURL : 'http://192.168.1.6:3009/api/v1'
            // baseURL : 'http://192.168.173.113:3009/api/v1'
        // baseURL : 'http://192.168.1.16:3009/api/v1'
        //  baseURL:'https://sgm.gmplmis.com/api-dealership/api/v1'      
};

export default config;
