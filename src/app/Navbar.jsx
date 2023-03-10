import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Outlet, Link, useLocation } from "react-router-dom";

export function Navbar(props) {
  const location = useLocation();

  let activeUrl = location.pathname === "/"
    ? ["active-link", "", ""]
    : location.pathname === "/users"
    ? ["", "active-link", ""]
    : ["", "", "active-link"];

  const [activeLink, setActiveLink] = useState(activeUrl);

  const arrPagesLink = ["/", "/users", "/photos"];
  const arrPagesName = ["Articles", "Users", "Photos"];

  let arrLinks = [];

  for (let i = 0; i < arrPagesLink.length; i++) {
    arrLinks.push(
      <Link
        onClick={() => handleClickLink(i)}
        key={i}
        className={activeLink[i]}
        to={arrPagesLink[i]}
      >
        {arrPagesName[i]}
      </Link>
    );
  }

  const handleClickLink = (i) => {
    let temp = activeLink.map((value, index) => {
      if (i === index) return "active-link";
      else return "";
    });

    setActiveLink(temp);
  };

  return (
    <>
      <div className="links-pages">{arrLinks}</div>
      <Outlet />
    </>
  );
}
