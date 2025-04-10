import axios from 'axios';
import {
  baseUrl,
  forgotPassword,
  loginApi,
  resetPassword,
} from '../../ConstantFiles/Api';
import {headers} from '../../ConstantFiles/Headers';
import {Platform} from 'react-native';

interface LoginData {
  email: string;
  password: string;
  device_type: string;
  device_token: string;
}

export const loginApiCalling = async (
  data: LoginData,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  onStatusFalse: (error: any) => void,
) => {
  console.log('api called',data);
  const urlStr = baseUrl + loginApi;
  try {
    await axios({
      method: 'post',
      url: urlStr,
      headers: headers,
      data: {
        email: data.email,
        password: data.password,
        device_type: data.device_type,
        device_token: data.device_token,
      },
    })
      .then(response => {
        if (response.data.status == true) {
          onSuccess(response.data);
        } else {
          // console.log('response.data', response.data);
          onStatusFalse(response.data);
        }
      })
      .catch(error => {
        onError(error.response?.data || error);
      });
  } catch (error: any) {
    onError(error.response?.data || error);
  }
};

export const forgotPasswordApiCalling = async (
  email: string,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  onStatusFalse: (error: any) => void,
) => {
  const urlStr = baseUrl + forgotPassword;
  try {
    await axios({
      method: 'post',
      url: urlStr,
      headers: headers,
      data: {
        email: email,
      },
    })
      .then(response => {
        if (response.data.status == true) {
          onSuccess(response.data);
        } else {
          // console.log('response.data', response.data);
          onStatusFalse(response.data);
        }
      })
      .catch(error => {
        onError(error.response?.data || error);
      });
  } catch (error: any) {
    onError(error.response?.data || error);
  }
};

export const resetPasswordApiCalling = async (
  email: string,
  password: string,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  onStatusFalse: (error: any) => void,
) => {
  const urlStr = baseUrl + resetPassword;
  try {
    await axios({
      method: 'post',
      url: urlStr,
      headers: headers,
      data: {
        email: email,
        password: password,
      },
    })
      .then(response => {
        if (response.data.status == true) {
          onSuccess(response.data);
        } else {
          // console.log('response.data', response.data);
          onStatusFalse(response.data);
        }
      })
      .catch(error => {
        onError(error.response?.data || error);
      });
  } catch (error: any) {
    onError(error.response?.data || error);
  }
};
