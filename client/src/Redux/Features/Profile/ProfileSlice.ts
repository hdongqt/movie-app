import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_LOADING_STATES } from '@/Constants/DefaultPagination';
import { updateProfile, updatePassword } from './ProfileAction';
const initialState = {
    ...DEFAULT_LOADING_STATES,
    isError: false
};

const ProfileSlice = createSlice({
    name: 'Profile',
    initialState: initialState,
    reducers: {
        resetSearchState: () => {
            return initialState;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(updateProfile.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(updateProfile.fulfilled, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false
                };
            })
            .addCase(updateProfile.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            })
            .addCase(updatePassword.pending, (state) => {
                return {
                    ...state,
                    isActionLoading: true,
                    isError: false
                };
            })
            .addCase(updatePassword.fulfilled, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: false
                };
            })
            .addCase(updatePassword.rejected, (state) => {
                return {
                    ...state,
                    isActionLoading: false,
                    isError: true
                };
            });
    }
});

export const ProfileAction = {
    updateProfile,
    updatePassword,
    ...ProfileSlice.actions
};
export default ProfileSlice.reducer;
