import { Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  articlesAdded,
  articlesUpdate,
  articlesAddStyle,
  articlesUpdateStyle,
} from "./articlesSlice";

import "./articles.scss";

import axios from "axios";

export function Articles() {
  const [countArticle, setCountArticle] = useState(100); // количество статей на экране
  const [gridTemplate, setGridTemplate] = useState("20% 20% 20%"); // количество статей в ряд
  const [modal, setModal] = useState("modal modal-hide"); // видно ли модульное окно
  const [modalFrom, setModalForm] = useState("modal-form modal-hide-form"); // видно ли модульное окно
  const [currentId, setId] = useState(""); // текущий id
  const [lastId, setLastId] = useState(0);
  const [modalBackground, setModalBackground] = useState("");
  const [posModal, setPosModal] = useState();
  // const [currentIdStyle, setCurrentIdStyle] = useState("");

  const dispatch = useDispatch();
  let articles = useSelector((state) => state.articles.articles);
  let articlesStyle = useSelector((state) => state.articles.articlesStyle);

  const refContainer = useRef([]);
  const refInput = useRef(null);
  const refTextarea = useRef(null);

  let body = document.body;

  const wrapper = {
    display: "grid",
    gap: "10px",
    justifyContent: "center",
    gridTemplateColumns: gridTemplate,
  };

  function StyleArticle(number) {
    let randomNumber;
    let styleArticle = {};

    if (number !== undefined) {
      randomNumber = number;
    } else {
      randomNumber = Math.floor(Math.random() * 3);
    }

    switch (randomNumber) {
      case 0:
        styleArticle = {
          id: 0,
          color: "white",
          backgroundColor: "black",
        };
        break;
      case 1:
        styleArticle = {
          id: 1,
          color: "#147b03",
          backgroundColor: "#dbcfff",
        };
        break;
      case 2:
        styleArticle = {
          id: 2,
          color: "#1d1142",
          backgroundColor: "#c68038",
        };
        break;
      default:
        styleArticle = {
          id: 3,
          color: "black",
          backgroundColor: "",
        };
        break;
    }

    return styleArticle;
  }

  let arr = [];
  let maxLengthTitle = 15;
  let maxLengthBody = 80;

  let temp = "https://jsonplaceholder.typicode.com/posts/";

  let count = 0;

  useEffect(() => {
    // создание articles
    axios.get(temp).then((resp) => {
      count++;

      if (count > 1) return;
      else if (articles.length > 0) return;

      let arrTitle = [];
      let arrBody = [];
      let arrStyle = [];

      let objResp = resp.data;

      for (let i = 0; i < objResp.length; i++) {
        arrTitle.push({
          id: i,
          content: objResp[i].title,
        });

        arrStyle.push({
          id: i,
          content: StyleArticle(),
        });

        setLastId((value) => value + 1);
      }

      for (let i = 0; i < objResp.length; i++) {
        arrBody.push({
          id: i,
          content: objResp[i].body,
        });
      }

      dispatch(articlesAddStyle(arrStyle));
      dispatch(articlesAdded(arrTitle));
      dispatch(articlesAdded(arrBody));
    });
  }, []);

  const arrTitle = articles[0];
  const arrBody = articles[1];
  const arrStyle = articlesStyle[0];

  const changeColor = (e, id) => {
    let tempColor = "";
    let currentIdStyle = "";

    switch (arrStyle[id].content.id) {
      case 0:
        currentIdStyle = 1;
        break;
      case 1:
        currentIdStyle = 2;
        break;
      case 2:
        currentIdStyle = 0;
        break;
      default:
        currentIdStyle = undefined;
        break;
    }

    tempColor = {
      id: id,
      content: StyleArticle(currentIdStyle),
    };

    // console.log(tempColor);

    dispatch(articlesUpdateStyle(tempColor));
  };

  if (countArticle !== undefined && articles.length > 0) {
    for (let i = 0; i < countArticle; i++) {
      // добавление articles на экран
      arr.push(
        <div
          ref={(el) => (refContainer.current[i] = el)}
          key={i}
          style={arrStyle[i].content}
          className="article-info"
        >
          <input
            id={i}
            type="text"
            className="article-info__title-name"
            disabled
            value={arrTitle[i].content.slice(0, maxLengthTitle) + "..."}
          />
          <textarea
            id={i}
            type="text"
            className="article-info__body-name"
            rows={3}
            readOnly
            disabled
            value={arrBody[i].content.slice(0, maxLengthBody) + "..."}
          />
          <div className="article-info__buttons">
            <button
              onClick={(e) => editArticle(e, i)}
              className="article-info__btn"
            >
              Edit
            </button>
            <button
              onClick={(e) => viewArticle(e.target, i)}
              className="article-info__btn"
            >
              View
            </button>
            <button
              onClick={(e) => changeColor(e, i)}
              className="article-info__btn"
            >
              Change Color
            </button>
          </div>
        </div>
      );
    }
  }

  const viewArticle = (e, id) => {
    // Делаю по центру модульное окно
    let styleModal = {
      top: 200,
    };

    setPosModal(styleModal);

    // просмотр карточки в модульном окне
    setModalBackground("modal-main-c");

    setModal(modal === "modal modal-hide" ? "modal" : "modal modal-hide");
    setId(id);

    body.classList.add("modal-main");
  };

  const closeModal = () => {
    setModal("modal modal-hide");
    body.classList.remove("modal-main");
    setModalBackground("");
  };

  const closeModalForm = () => {
    setModalForm("modal-form modal-hide-form");
    body.classList.remove("modal-main");
    setModalBackground("");
  };

  const addArticle = (e) => {
    if (countArticle + 3 > arrTitle.length) {
      e.target.className = "hidden";
      setCountArticle(arrTitle.length);
    } else {
      e.target.className = "btn";
      setCountArticle((value) => value + 3);
    }
  };

  const makeBigArticle = (e) => {
    e.target.innerHTML =
      e.target.innerHTML === "Make big cards"
        ? "Make small cards"
        : "Make big cards";
    setGridTemplate((value) => {
      return value === "20% 20% 20%" ? "20% 20%" : "20% 20% 20%";
    });
  };

  const addArticles = (e) => {
    // модульное окно с формой для добавления новой записи
    setModalBackground((value) =>
      value === "modal-main-c" ? "" : "modal-main-c"
    );

    body.classList.toggle("modal-main");

    let styleModal = {
      top: 200,
    };

    setPosModal(styleModal);

    setModalForm(
      modalFrom === "modal-form modal-hide-form"
        ? "modal-form"
        : "modal-form modal-hide-form"
    );
  };

  const handleSubmitAdd = (e) => {
    // получаю значения из полей, и сохраняю в глобальных состониях Redux
    addArticles();

    let titleValue = {
      id: lastId,
      content: e.target.form[0].value,
    };

    let bodyValue = {
      id: lastId,
      content: e.target.form[1].value,
    };

    setLastId((value) => value + 1);

    setCountArticle((value) => value + 1);

    dispatch(articlesAdded({ titleValue, bodyValue }));

    dispatch(articlesAddStyle({ id: lastId, content: StyleArticle() }));
  };

  const editArticle = (e, id) => {
    let inputField = document.querySelector(".input-form");
    let textareaField = document.querySelector(".textarea-form");

    setId(id);

    inputField.value = arrTitle[id].content;
    textareaField.value = arrBody[id].content;

    // модульное окно с формой для добавления новой записи
    setModalBackground((value) =>
      value === "modal-main-c" ? "" : "modal-main-c"
    );

    body.classList.toggle("modal-main");

    let styleModal = {
      top: 200,
    };

    setPosModal(styleModal);

    setModalForm(
      modalFrom === "modal-form modal-hide-form"
        ? "modal-form-update"
        : "modal-form modal-hide-form"
    );
    // console.log(id);
  };

  const updateArticle = () => {
    addArticles();

    dispatch(
      articlesUpdate({
        id: currentId,
        title: refInput.current.value,
        body: refTextarea.current.value,
      })
    );
  };

  return (
    <div className="main-wrapper">
      <div className={modalBackground}></div>
      <div style={posModal} className={modal}>
        <a
          onClick={closeModal}
          className={
            modal === "modal" ? "modal-close" : "modal-close modal-hide"
          }
        ></a>
        <p className="article-about">Article Info</p>
        <hr />
        <p className="article-info__title-name">
          {currentId !== "" ? arrTitle[currentId].content : ""}
        </p>
        <p className="article-info__body-name">
          {currentId !== "" ? arrBody[currentId].content : ""}
        </p>
      </div>

      <div style={posModal} className={modalFrom}>
        <a
          onClick={closeModalForm}
          className={
            // modal-form-update

            modalFrom === "modal-form"
              ? "modal-close-form"
              : modalFrom === "modal-form-update"
              ? "modal-close-form"
              : "modal-close-form modal-hide-form"
          }
        ></a>
        <form className="form-newArticles">
          <input
            ref={refInput}
            type="text"
            name=""
            id=""
            placeholder="Title..."
            className="input-form"
          />
          <textarea
            ref={refTextarea}
            name=""
            id=""
            placeholder="Body..."
            className="textarea-form"
          ></textarea>
          <input
            onClick={(e) => {
              if (modalFrom === "modal-form") {
                handleSubmitAdd(e);
              } else {
                updateArticle(e);
              }
            }}
            type="button"
            value={modalFrom === "modal-form" ? "Create" : "Edit"}
          />
        </form>
      </div>

      <div className="container">
        <div className="main-wrapper__title">
          <h1>Страница Articles</h1>

          <div className="main-warpper__buttons">
            <button onClick={makeBigArticle} className="btn">
              Make big cards
            </button>
            <button onClick={addArticles} className="btn">
              Add Articles
            </button>
          </div>
        </div>
        <div style={wrapper}>{arr}</div>
        {/* список  статей*/}
        <button onClick={addArticle} className="btn">
          Show more
        </button>
      </div>
    </div>
  );
}
