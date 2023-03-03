import { createSlice, nanoid } from "@reduxjs/toolkit";

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    articlesStyle: [],
  },
  reducers: {
    articlesAdded(state, action) {
      const { titleValue, bodyValue } = action.payload;

      if (titleValue !== undefined) {
        state.articles[0].push(titleValue);
        state.articles[1].push(bodyValue);
      } else {
        state.articles.push(action.payload);
      }
    },
    articlesUpdate(state, action) {
      const { id, title, body } = action.payload;

      const articleUpdateCurrentTitle = state.articles[0].find(
        (article) => article.id === id
      );
      const articleUpdateCurrentBody = state.articles[1].find(
        (article) => article.id === id
      );

      if (articleUpdateCurrentTitle && articleUpdateCurrentBody) {
        articleUpdateCurrentTitle.content = title
        articleUpdateCurrentBody.content = body
      }
    },
    articlesAddStyle(state, action) {
      const { id, content } = action.payload;

      if (id !== undefined) {
        state.articlesStyle[0].push(action.payload);
      } else state.articlesStyle.push(action.payload);
    },
    articlesUpdateStyle(state, action) {
      const { id, content } = action.payload;

      const currentStyle = state.articlesStyle[0].find(
        (style) => style.id === id
      );

      if (currentStyle) {
        currentStyle.content = content;
      }
    },
  },
});

export const {
  articlesAdded,
  articlesUpdate,
  articlesAddStyle,
  articlesUpdateStyle,
} = articlesSlice.actions;

export default articlesSlice.reducer;
