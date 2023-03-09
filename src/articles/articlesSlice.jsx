import { createSlice, nanoid } from "@reduxjs/toolkit";

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
  },
  reducers: {
    articlesAllAdd(state, action) {
      // console.log(action.payload)
      state.articles.length = 0;

      state.articles.push(action.payload);
    },
    articlesAdd(state, action) {
      state.articles[0].push(action.payload)
    },
    articlesEdit(state, action) {
      const { id, title, body } = action.payload;

      state.articles.filter((articles) => {
        articles.map((value, index) => {
          if (value.id === id) {
            value.title = title;
            value.body = body;
          }
        });
      });

      // console.log(id)
    },
    articlesDelete(state, action) {
      const { id } = action.payload;
      let arr = []

      state.articles.filter((articles) => {
        articles.map((value) => {
          if (value.id === id) {

          }
          else {
            arr.push(value)
          }
        })

        state.articles.length = 0
        state.articles.push(arr);
      })
    },
  },
});

export const { articlesAllAdd, articlesAdd, articlesEdit, articlesDelete } =
  articlesSlice.actions;

export default articlesSlice.reducer;
