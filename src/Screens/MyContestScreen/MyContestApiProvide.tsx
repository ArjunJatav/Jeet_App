import axios from 'axios';
import {
  baseUrl,
  getcontestTeam,
  liveMatchInfoApi,
  myCompleteContestApi,
  myContestApi,
  myMatchesApi,
} from '../../ConstantFiles/Api';
import {headers} from '../../ConstantFiles/Headers';

export const fetchMyContestList = async (
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  onStatusFalse: (error: any) => void,
  authToken: string, // Accept authToken as a parameter
) => {
  console.log('API called');
  console.log('Auth Token:', authToken);

  const urlStr = `${baseUrl}${myMatchesApi}`;

  try {
    await axios({
      method: 'get',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`, // Append token to headers
      },
    })
      .then(response => {
        if (response.data.status === true) {
          onSuccess(response.data);
          //  console.log("Response data:", response.data);
        } else {
          //  console.log("Response data", response.data);
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


export const myContestList = async (
  authToken: string, // Accept authToken as a parameter
  matchId: string,   // Accept matchId as a parameter
) => {
  console.log('API called');


  const urlStr = `${baseUrl}${myContestApi}?matches_id=${matchId}`;
  console.log('urlStr:', urlStr);
  console.log('Auth Token:', authToken);
  try {
    const response = await axios({
      method: 'get',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`, // Append token to headers
      },
    });
   

    if (response.data.status === true) {
      return response;  // Return data on success
    } else {
      throw new Error('Status is false');  // Throw error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};

export const getContestTeam = async (
  authToken: string, // Accept authToken as a parameter
  matchId: string,   // Accept matchId as a parameter
 
) => {
  console.log('API called');
  const urlStr = `${baseUrl}${getcontestTeam}?matches_id=${matchId}`;
  
  // Log the authToken and URL
  // console.log('Auth Token:', authToken);
  console.log('Request URL:', urlStr);

  try {
    const response = await axios({
      method: 'get',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`, // Append token to headers
      },
    });
// console.log("response.dataresponse.dataresponse.data",response);

    if (response.data.status === true) {
      return response.data.data;  // Return data if status is true
    } else {
      throw new Error('Status is false');  // Throw an error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};

export const myCompleteContestList = async (
  authToken: string, // Accept authToken as a parameter
  matchId: string,   // Accept matchId as a parameter
) => {
  console.log('API called');


  const urlStr = `${baseUrl}${myCompleteContestApi}?matches_id=${matchId}`;
  console.log('urlStr:', urlStr);
  console.log('Auth Token:', authToken);
  try {
    const response = await axios({
      method: 'get',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`, // Append token to headers
      },
    });
   

    if (response.data.status === true) {
      return response;  // Return data on success
    } else {
      throw new Error('Status is false');  // Throw error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};


export const liveMatchApi = async (
  authToken: string, // Accept authToken as a parameter
  matchId: string,   // Accept matchId as a parameter
) => {
  console.log('API called');


  const urlStr = `${baseUrl}${liveMatchInfoApi}?matches_id=${matchId}`;
  console.log('urlStr:', urlStr);
  console.log('Auth Token:', authToken);
  try {
    const response = await axios({
      method: 'get',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`, // Append token to headers
      },
    });
   

    if (response.data.status === true) {
      return response.data.data;  // Return data on success
    } else {
      throw new Error('Status is false');  // Throw error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};