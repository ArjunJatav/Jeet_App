import axios from "axios";
import { baseUrl, otpVerify, resendOtp, signupApi } from "../../ConstantFiles/Api";
import { headers } from '../../ConstantFiles/Headers';
import { Platform } from "react-native";


interface SignUpData {
    name: string;
    email: string;
    password: string;
    referralCode?: string; // Optional property
  }


export const signUpApiCalling = async (
   data:SignUpData,
   onSuccess: (response: any) => void,
  onError: (error: any) => void
  ) => {
  console.log("api called",data)
    const urlStr = baseUrl + signupApi;
    try {
      await axios({
        method: "post",
        url: urlStr,
        headers: headers,
        data: {
            name:data.name,
            email:data.email,
            password:data.password,
            device_type:Platform.OS,
            device_token:"",
            referral_code:data.referralCode
        },
      })
        .then((response) => {
          if (response.data.status == true) {
            onSuccess(response.data);
          } else {
            console.log("response.data",response.data)
            onError(response.data.message || "Signup failed");
          }
        })
        .catch((error) => {
            onError(error.response?.data || error);
        
        });
    } catch (error : any) {
        onError(error.response?.data || error);
    }
  };

  export const otpApiCalling = async (
    email : string,otp : number,action : string,
    onSuccess: (response: any) => void,
   onError: (error: any) => void
   ) => {
   console.log("api called")
     const urlStr = baseUrl + otpVerify;
     try {
       await axios({
         method: "post",
         url: urlStr,
         headers: headers,
         data: {
          email:email,
          otp:otp,
          action:action
         },
       })
         .then((response) => {
           if (response.data.status == true) {
             onSuccess(response.data);
           } else {
             console.log("response.data",response.data)
             onError(response.data.message || "Signup failed");
           }
         })
         .catch((error) => {
             onError(error.response?.data || error);
         
         });
     } catch (error : any) {
         onError(error.response?.data || error);
     }
   };

   export const resendOtpApiCalling = async (
    email : string,
    onSuccess: (response: any) => void,
   onError: (error: any) => void
   ) => {
   console.log("api called")
     const urlStr = baseUrl + resendOtp;
     try {
       await axios({
         method: "post",
         url: urlStr,
         headers: headers,
         data: {
          email:email
         },
       })
         .then((response) => {
           if (response.data.status == true) {
             onSuccess(response.data);
           } else {
             console.log("response.data",response.data)
             onError(response.data.message || "Signup failed");
           }
         })
         .catch((error) => {
             onError(error.response?.data || error);
         
         });
     } catch (error : any) {
         onError(error.response?.data || error);
     }
   };