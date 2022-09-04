import { createSlice } from "@reduxjs/toolkit";

export const allPlaylistsSlice = createSlice({
  name: "allPlaylists",
  initialState: {
    value: [],
  },
  reducers: {
    fetchallplaylists: (state, action) => {
      state.value = action.payload.map((doc) => ({
        ...doc.data(),
        Id: doc.id,
      }));
    },
    searchfilter: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { fetchallplaylists, searchfilter } = allPlaylistsSlice.actions;
export const selectAllPlaylists = (state) => state.allPlaylists.value;

export default allPlaylistsSlice.reducer;
