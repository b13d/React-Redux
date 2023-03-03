import { configureStore } from "@reduxjs/toolkit";

// этот файл отвечает за глобальные переменные Redux

import articlesReductor from "../articles/articlesSlice";
// здесь импорт редюсеров

export default configureStore({
  reducer: {
    articles: articlesReductor,
    // здесь сами редюсеры
  },
});
