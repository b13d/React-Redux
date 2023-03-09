import { createSlice, nanoid } from "@reduxjs/toolkit";

const photosSlice = createSlice({
  name: "photos",
  initialState: {
    photos: [],
  },
  reducers: {
    photosAllAdd(state, action) {
      // console.log(action.payload)
      state.photos.length = 0;

      state.photos.push(action.payload);
    },
    photosAdd(state, action) {
      state.photos[0].push(action.payload);
    },
    photosEdit(state, action) {
      const { id } = action.payload;

      let newPhotos = [];

      state.photos.filter((photos) => {
        photos.map((value, index) => {
          if (value.id === id) {
            newPhotos.push(action.payload);
          } else newPhotos.push(value);
        });

        state.photos.length = 0
        state.photos.push(newPhotos)
      });

      // console.log(id)
    },
    photosDelete(state, action) {
      const { id } = action.payload;
      let arr = [];

      state.photos.filter((photos) => {
        photos.map((value) => {
          if (value.id === id) {
          } else {
            arr.push(value);
          }
        });

        state.photos.length = 0;
        state.photos.push(arr);
      });
    },
  },
});

export const { photosAllAdd, photosAdd, photosEdit, photosDelete } =
  photosSlice.actions;

export default photosSlice.reducer;
