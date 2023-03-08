import {
  Routes,
  Route,
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import React, { useState } from "react";

import { Users } from "./users/Users";
import { Photos } from "./photos/Photos";
import { Articles } from "./articles/Articles";
import { NotFoundPage } from "./articles/NotFoundPage";
import { Navbar } from "./app/Navbar";

export default function App() {
  const [links, setLinksActive] = useState([
    "header__link header__link-active",
    "header__link",
    "header__link",
  ]);

  console.log("Рендер");

  const handleLink = (e) => {
    let temp = links.map((value, index) => {
      if (index === e) {
        return "header__link header__link-active";
      } else {
        return "header__link";
      }
    });

    console.log(temp);

    setLinksActive(temp);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/",
          element: <Articles />,
          errorElement: <NotFoundPage />,
        },
        {
          path: "/users",
          element: <Users />,
          errorElement: <NotFoundPage />,
        },
        {
          path: "/photos",
          element: <Photos />,
          errorElement: <NotFoundPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
