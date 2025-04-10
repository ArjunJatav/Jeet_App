import axios from 'axios';
import {
  addAmountApi,
  baseUrl,
  cancelWithdrawalRequestApi,
  feedbackApi,
  getNotificationApi,
  logOutApi,
  myCompleteContestApi,
  myCompleteMatechesApi,
  termAndConditionApi,
  transactionHistoryApi,
  updateProfileApi,
  userProfileDetails,
  withdrawalRequestApi,
  withdrawalRequestHistoryApi,
} from '../../ConstantFiles/Api';
import {headers} from '../../ConstantFiles/Headers';

export const fetchUserProfileDetails = async (authToken: string) => {
  const urlStr = baseUrl + userProfileDetails;

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
      return response.data; // Return the response data directly
    } else {
      throw new Error('Status is false');
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const LogOut = async (authToken: string): Promise<any> => {
  // Return a promise that resolves to the response

  const urlStr = baseUrl + logOutApi;

  try {
    const response = await axios({
      method: 'get',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.error('authToken', response);

    if (response.data.status === true) {
      return response.data; // Return data for the success case
    } else {
      throw new Error('Status is false'); // Throw error if status is false
    }
  } catch (error: any) {
    console.error('API call error:', error);
    throw error; // Re-throw the error to be caught in the caller
  }
};

export const termsandConditon = async (authToken: string) => {
  const urlStr = baseUrl + termAndConditionApi;

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
      return response.data; // Return the response data directly
    } else {
      throw new Error('Status is false');
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const addAmountMethod = async (
  data: any,
  authToken: string,
): Promise<any> => {
  // Return a promise that resolves to the response
  console.log('datadatadatadata>>', data);

  const urlStr = baseUrl + addAmountApi;
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
      throw new Error('Status is false'); // Throw error if status is false
    }
  } catch (error: any) {
    console.error('API call error:', error);
    throw error; // Re-throw the error to be caught in the caller
  }
};

export const getTransactionHistory = async (authToken: string, FilterData: any) => {
  const transactionType = FilterData?.type ?? '';
  const startDate = FilterData?.time?.from ?? '';
  const endDate = FilterData?.time?.to ?? '';

  console.log("FilterData:", FilterData);
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  const urlStr =
    baseUrl +
    transactionHistoryApi +
    "?transaction_type=" + transactionType +
    "&start_date=" + startDate +
    "&end_date=" + endDate;

  console.log("Constructed URL:", urlStr);

  try {
    const response = await axios({
      method: 'get',
      url: urlStr,
      headers: {
        ...headers,
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.status === true) {
      return response.data;
    } else {
      throw new Error('Status is false');
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getNotification = async (authToken: string) => {
  const urlStr = baseUrl + getNotificationApi;

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
      return response.data; // Return the response data directly
    } else {
      throw new Error('Status is false');
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const withdrawAmountMethod = async (
  data: any,
  authToken: string,
): Promise<any> => {
  // Return a promise that resolves to the response
  console.log('datadatadatadata>>', data);

  const urlStr = baseUrl + withdrawalRequestApi;
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
    console.log('datadatadatadata>>', response.data);

    if (response.data.status === true) {
      return response.data; // Return data for the success case
    } else {
      throw new Error('Status is false'); // Throw error if status is false
    }
  } catch (error: any) {
    console.error('API call error:', error);
    throw error; // Re-throw the error to be caught in the caller
  }
};

export const getWithdrawRequestHistory = async (authToken: string) => {
  const urlStr = baseUrl + withdrawalRequestHistoryApi;

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
      return response.data; // Return the response data directly
    } else {
      throw new Error('Status is false');
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const cancelWithdrawAmountMethod = async (
  data: any,
  authToken: string,
): Promise<any> => {
  // Return a promise that resolves to the response
  console.log('datadatadatadata>>', data);

  const urlStr = baseUrl + cancelWithdrawalRequestApi;
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
    console.log('datadatadatadata>>', response.data);

    if (response.data.status === true) {
      return response.data; // Return data for the success case
    } else {
      throw new Error('Status is false'); // Throw error if status is false
    }
  } catch (error: any) {
    console.error('API call error:', error);
    throw error; // Re-throw the error to be caught in the caller
  }
};

export const submitFeedback = async (
  data: any,
  authToken: string,
): Promise<any> => {
  // Return a promise that resolves to the response
  console.log('datadatadatadata>>', data);

  const urlStr = baseUrl + feedbackApi;
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
    console.log('datadatadatadata>>', response.data);

    if (response.data.status === true) {
      return response.data; // Return data for the success case
    } else {
      throw new Error('Status is false'); // Throw error if status is false
    }
  } catch (error: any) {
    console.error('API call error:', error);
    throw error; // Re-throw the error to be caught in the caller
  }
};

export const updateProfilePhoto = async (
  data: any,
  authToken: string,
): Promise<any> => {

  const urlStr = baseUrl + updateProfileApi;
  try {
    const response = await axios({
      method: 'post',
      url: urlStr,
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
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


export const getCompleteMatchApi = async (authToken: string) => {
  const urlStr = baseUrl + myCompleteMatechesApi;

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
      return response.data; // Return the response data directly
    } else {
      throw new Error('Status is false');
    }
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
