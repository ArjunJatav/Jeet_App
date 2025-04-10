import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import profileSlice from './profileDataSlice';
import fcmTokenSlice from './fcmToken';


const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileSlice, // Add profile reducer
    fcmToken: fcmTokenSlice, // Add profile reducer
  },
 

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
