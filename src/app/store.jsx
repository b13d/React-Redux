import { configureStore } from "@reduxjs/toolkit";

// этот файл отвечает за глобальные переменные Redux

import articlesReductor from "../articles/articlesSlice";
import photosReductor from "../photos/photosSlice";
import usersReductor from "../users/usersSlice";
// здесь импорт редюсеров

export default configureStore({
  reducer: {
    articles: articlesReductor,
    photos: photosReductor,
    users: usersReductor,
    // здесь сами редюсеры
  },
});
