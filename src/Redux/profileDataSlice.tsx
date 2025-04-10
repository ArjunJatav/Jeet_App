import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileData {
  [key: string]: any; // Generic to handle dynamic keys
}

interface ProfileState {
  data: ProfileData | null;
}

const initialState: ProfileState = {
  data: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileData>) {
      state.data = action.payload;
    },
    clearProfile(state) {
      state.data = null;
    },
    updateProfile(state, action: PayloadAction<Partial<ProfileData>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
});

export const { setProfile, clearProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
