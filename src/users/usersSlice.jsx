import { createSlice, nanoid } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {
    usersAllAdd(state, action) {
      // console.log(action.payload)
      state.users.length = 0;

      state.users.push(action.payload);
    },
    usersAdd(state, action) {
      state.users[0].push(action.payload);
    },
    usersEdit(state, action) {
      const { id } = action.payload;

      console.log(action.payload);
      
      let newUsers = []

      state.users.filter((users) => {
        users.map((value, index) => {
          if (value.id === id) {
            newUsers.push(action.payload);
          } else newUsers.push(value);
        });

        console.log(newUsers)

        state.users.length = 0
        state.users.push(newUsers)
      });

      // console.log(id)
    },
    usersDelete(state, action) {
      const { id } = action.payload;
      let arr = [];

      state.users.filter((users) => {
        users.map((value) => {
          if (value.id === id) {
          } else {
            arr.push(value);
          }
        });

        state.users.length = 0;
        state.users.push(arr);
      });
    },
  },
});

export const { usersAllAdd, usersAdd, usersEdit, usersDelete } =
  usersSlice.actions;

export default usersSlice.reducer;
