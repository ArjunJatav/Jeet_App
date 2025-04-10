import axios from 'axios';
import {
  baseUrl,
  createTeam,
  getTeamList,
  getTeamPlayers,
  joinContestApi,
  matchesContestList,
  matchesListApi,
  PlayersInfoApi,
  updateDeviceToken,
} from '../../ConstantFiles/Api';
import {headers} from '../../ConstantFiles/Headers';

export const fetchMatchList = async (
  authToken: string,
  pageValue: string
) => {
  // console.log('API called');

  // Log the authToken
  // console.log('Auth Token:', authToken);

  const urlStr = `${baseUrl}${matchesListApi}?page=${pageValue}`;

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
      return response.data; // Return response data if status is true
    } else {
      throw new Error('Status is false'); // Handle status false
    }
  } catch (error: any) {
    throw error.response?.data || error; // Throw error if the request fails
  }
};


export const matchContestList = async (
  authToken: string, // Accept authToken as a parameter
  matchId: string,   // Accept matchId as a parameter
) => {
  // console.log('API called');
  // console.log('Auth Token:', authToken);

  const urlStr = `${baseUrl}${matchesContestList}?matches_id=${matchId}`;

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
      return response.data;  // Return data on success
    } else {
      throw new Error('Status is false');  // Throw error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};


export const getMatchPlayersData = async (
  authToken: string, // Accept authToken as a parameter
  matchId: string,   // Accept matchId as a parameter
) => {
  // console.log('API called');
  const urlStr = `${baseUrl}${getTeamPlayers}?matches_id=${matchId}`;
  
  // Log the authToken and URL
  // console.log('Auth Token:', authToken);
  // console.log('Request URL:', urlStr);

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
      return response.data.data;  // Return data if status is true
    } else {
      throw new Error('Status is false');  // Throw an error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};



export const createTeamApi = async (
  data: any, // Assuming data is of type 'any', replace with your specific type
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  onStatusFalse: (error: any) => void,
  authToken: string,
) => {
  // console.log('datadatadatadata>>', data);

  const urlStr = baseUrl + createTeam;
  try {
    const response = await axios({
      method: 'post',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`, // Pass auth token in header
      },
      data: data, // Pass data
    });

    if (response.data.status === true) {
      onSuccess(response.data);
    } else {
      // console.log('Response data status false:', response.data);
      onStatusFalse(response.data);
    }
  } catch (error: any) {
    console.error('API call error:', error);
    onError(error.response?.data || error); // Handle error
  }
};

export const getContestTeam = async (
  authToken: string, // Accept authToken as a parameter
  matchId: string,   // Accept matchId as a parameter
) => {
  // console.log('API called');
  const urlStr = `${baseUrl}${getTeamList}?matches_id=${matchId}`;
  
  // Log the authToken and URL
  // console.log('Auth Token:', authToken);
  // console.log('Request URL:', urlStr);

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
      return response.data.data;  // Return data if status is true
    } else {
      throw new Error('Status is false');  // Throw an error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};


export const joinContest = async (
  data: any, 
  authToken: string,
): Promise<any> => { // Return a promise that resolves to the response
  // console.log('datadatadatadata>>', data);

  const urlStr = baseUrl + joinContestApi;
  try {
    const response = await axios({
      method: 'post',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`,
      },
      data: data,
    });

    if (response.data.status === true) {
      return response.data; // Return data for the success case
    } else {
      return response.data.message;
      
    }

  } catch (error: any) {
    console.error('API call error:', error);
    throw error; // Re-throw the error to be caught in the caller
  }
};

export const getPlayerInfoApi = async (
  authToken: string, // Accept authToken as a parameter
  playerId: string,   // Accept matchId as a parameter
) => {
  // console.log('API called');
  const urlStr = `${baseUrl}${PlayersInfoApi}?player_id=${playerId}`;


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
      return response.data.data;  // Return data if status is true
    } else {
      throw new Error('Status is false');  // Throw an error if status is false
    }
  } catch (error: any) {
    throw error.response?.data || error;  // Throw error on failure
  }
};


export const updateFcmTokenApi = async (
  data: any, 
  authToken: string,
): Promise<any> => { // Return a promise that resolves to the response
  // console.log('datadatadatadata>>', data);

  const urlStr = baseUrl + updateDeviceToken;
  try {
    const response = await axios({
      method: 'post',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`,
      },
      data: data,
    });

    if (response.data.status === true) {
      return response.data; // Return data for the success case
    } else {
      return response.data.message;
      
    }

  } catch (error: any) {
    console.error('API call error:', error);
    throw error; // Re-throw the error to be caught in the caller
  }
};