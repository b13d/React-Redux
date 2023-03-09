import React, { useRef, useState, useEffect } from "react";
import {
  articlesAdd,
  articlesEdit,
  articlesDelete,
  articlesAllAdd,
} from "../articles/articlesSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./articles.scss";

let tempAxios = axios
  .get("https://jsonplaceholder.typicode.com/posts")
  .then(function (response) {
    // handle success

    // console.log(response.data)
    return response.data;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

export function Articles() {
  const [arrArticles, setArticles] = useState(getStoredState);
  const [modalInfo, setModalInfo] = useState("");
  const [countArticles, setCountArticles] = useState(3);
  const [modal, toogleModal] = useState("modal hidden");
  const [modalBackground, toogleModalBackground] = useState(
    "modalBackground hidden"
  );

  const [modalClose, toogleModalClose] = useState("modalClose hidden");
  const [lastId, setLastId] = useState(101);
  const [showMoreBtn, toogleShowMoreBtn] = useState("show-more-btn");
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextarea] = useState("");
  const [gridTemplate, setGridTemplate] = useState("30% 30% 30%"); // количество статей в ряд

  const refInput = useRef();
  const refTextarea = useRef();
  const dispatch = useDispatch();
  const articlesSelector = useSelector((state) => state.articles.articles);

  const styleColumns = {
    gridTemplateColumns: gridTemplate,
  };

  const styleArticle = (id, idStyle) => {
    let ranNumber = Math.floor(Math.random() * 3);

    let styleColors = {};

    switch (idStyle !== undefined ? idStyle : ranNumber) {
      case 0:
        styleColors = {
          id: 0,
          color: "#286f45",
          backgroundColor: "#dbcfff",
        };
        break;
      case 1:
        styleColors = {
          id: 1,
          color: "#131057",
          backgroundColor: "#cc843a",
        };
        break;
      case 2:
        styleColors = {
          id: 2,
          color: "white",
          backgroundColor: "black",
        };
        break;

      default:
        styleColors = {
          id: 3,
          color: "black",
          backgroundColor: "white",
        };
        break;
    }

    return styleColors;
  };

  function getStoredState(count) {
    if (count > 100) {
      toogleShowMoreBtn("show-more-btn hidden");
    }

    if (count === undefined) {
      tempAxios.then((data) => {
        let arr = [];

        for (let i = 0; i < countArticles; i++) {
          let tempAxios = styleArticle(data[i].id);

          // заполнение articles divs *** пометка ***
          arr.push({
            userId: data[i].userId,
            id: data[i].id,
            title: data[i].title,
            body: data[i].body,
            idStyle: tempAxios.id,
            color: tempAxios.color,
            backgroundColor: tempAxios.backgroundColor,
          });
        }

        // console.log(data);

        if (
          articlesSelector[0] === undefined ||
          articlesSelector[0].length === 0
        ) {
          setArticles(arr);
          dispatch(articlesAllAdd(arr));
        }
      });
    } else {
      tempAxios.then((data) => {
        let arr = [];

        for (let i = count - 3; i < (count > 100 ? 100 : count); i++) {
          // заполнение articles divs *** пометка ***
          let tempAxios = styleArticle(data[i].id);

          console.log(countArticles);
          console.log(count);

          arr.push({
            userId: data[i].userId,
            id: data[i].id,
            title: data[i].title,
            body: data[i].body,
            idStyle: tempAxios.id,
            color: tempAxios.color,
            backgroundColor: tempAxios.backgroundColor,
          });
        }

        // console.log(data);
        setArticles((arrArticles) => {
          let temp = [...arrArticles, ...arr];
          // dispatch(articlesAdd(temp));

          // console.log(q)
          dispatch(articlesAllAdd(temp));

          return temp;
        });
      });
    }
  }

  function makeCard() {
    setGridTemplate((value) => {
      let temp = value === "30% 30% 30%" ? "30% 30%" : "30% 30% 30%";
      return temp;
    });
  }

  async function addArticles() {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    let modalTemp = {};

    modalTemp = (
      <>
        <label>Title: </label>
        <input ref={refInput} type="text" />
        <label>Body: </label>
        <textarea ref={refTextarea} rows={5} type="text" />
        <button onClick={() => addArt()}>Create</button>
      </>
    );

    function addArt() {
      toogleModal("modal hidden");
      toogleModalBackground("modalBackground hidden");
      toogleModalClose("modalClose hidden");

      const { id, color, backgroundColor } = styleArticle();

      let temp = {
        userId: 10,
        id: lastId,
        title: refInput.current.value,
        body: refTextarea.current.value,
        idStyle: id,
        color: color,
        backgroundColor: backgroundColor,
      };

      dispatch(articlesAdd(temp));

      setLastId((value) => value + 1);
    }

    console.log(modalTemp);

    setModalInfo(modalTemp);
  }

  async function updateArticles(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    setArticles((value) => {
      let modalTemp = {};
      let valueInput = "";
      let valueTextarea = "";

      value.map((value) => {
        if (Number(value.id) === id) {
          modalTemp = (
            <>
              <label>Title: </label>
              <input
                defaultValue={value.title}
                ref={refInput}
                type="text"
                value={setInputValue((q) => {
                  return value.title;
                })}
              />
              <label>Body: </label>
              <textarea
                defaultValue={value.body}
                ref={refTextarea}
                rows={5}
                type="text"
                value={setInputValue((q) => {
                  return value.body;
                })}
              />
              <button onClick={() => changeArticle(value.id)}>Update</button>
            </>
          );
        }
      });

      setModalInfo(modalTemp);

      return value;
    });
  }

  function deleteArticles(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    let modalTemp = (
      <>
        <label>Вы действительно хотите удалить эту запись?</label>
        <button onClick={() => deleteArticle(id)}>Да</button>
        <button onClick={() => closeModal(false)}>Нет</button>
      </>
    );

    setModalInfo(modalTemp);

    let deleteArticle = (id) => {
      dispatch(articlesDelete({ id }));

      closeModal();
    };
  }

  function changeColor(id) {
    let arr = arrArticles.map((value, index) => {
      if (value.id === id) {
        let tempId =
          value.idStyle === 0
            ? 1
            : value.idStyle === 1
            ? 2
            : value.idStyle === 2
            ? 0
            : 1;

        console.log(tempId);

        let tempStyle = styleArticle(value.id, tempId);

        console.log(tempStyle);

        let currentArticle = {
          userId: value.userId,
          id: value.id,
          title: value.title,
          body: value.body,
          idStyle: tempStyle.id,
          color: tempStyle.color,
          backgroundColor: tempStyle.backgroundColor,
        };
        return currentArticle;
      } else {
        return value;
      }
    });
    setArticles(arr);
  }

  function showArticle(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    setArticles((value) => {
      let modalTemp = {};

      value.map((value) => {
        if (Number(value.id) === id) {
          modalTemp = (
            <>
              <p>{value.title}</p>
              <p>{value.body}</p>
            </>
          );
        }
      });

      console.log(modalTemp);

      setModalInfo(modalTemp);
      return value;
    });
  }

  const closeModal = () => {
    toogleModalClose("modalClose hidden");
    toogleModal("modal hidden");
    toogleModalBackground("modalBackground hidden");

    setModalInfo("");
  };

  async function showMore() {
    let count = "";

    await setCountArticles((value) => {
      count = value + 3;
      return count;
    });

    await getStoredState(count);

    // console.log(countArticles);
  }

  // change articles
  useEffect(() => {
    setArticles(articlesSelector[0]);
  }, [articlesSelector]);

  function changeArticle(id) {
    toogleModal("modal hidden");
    toogleModalBackground("modalBackground hidden");
    toogleModalClose("modalClose hidden");
    setModalInfo("");

    let temp = {
      id: id,
      title: refInput.current.value,
      body: refTextarea.current.value,
    };

    dispatch(articlesEdit(temp));
  }

  const styleColorBackground = (color, background) => {
    let temp = {
      color: color,
      backgroundColor: background,
    };

    return temp;
  };

  if (arrArticles !== undefined) {
    let arr = [];

    for (let i = 0; i < arrArticles.length; i++) {
      arr.push(
        <div
          style={styleColorBackground(
            arrArticles[i].color,
            arrArticles[i].backgroundColor
          )}
          className="article"
          key={i}
        >
          <div>
            <p>
              {arrArticles[i].title.length > 20
                ? arrArticles[i].title.substring(0, 20) + "..."
                : arrArticles[i].title}
            </p>
            <p>
              {arrArticles[i].title.length > 80
                ? arrArticles[i].body.substring(0, 80) + "..."
                : arrArticles[i].body}
            </p>
          </div>
          <div className="articles__buttons">
            <button
              onClick={() => {
                showArticle(arrArticles[i].id);
              }}
              className="articles__buttons-btn"
            >
              Show
            </button>
            <button
              onClick={() => {
                deleteArticles(arrArticles[i].id);
              }}
              className="articles__buttons-btn"
            >
              Delete
            </button>
            <button
              onClick={() => {
                updateArticles(arrArticles[i].id);
              }}
              className="articles__buttons-btn"
            >
              Edit
            </button>
            <button
              onClick={() => {
                changeColor(arrArticles[i].id);
              }}
              className="articles__buttons-btn"
            >
              Change color
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={modalBackground}></div>
        <div className={modal}>
          <div onClick={() => closeModal()} className={modalClose}>
            x
          </div>
          {modalInfo}
        </div>

        <div className="header-info">
          <h1>Article List</h1>
          <div className="buttons">
            <button onClick={addArticles} className="buttons__btn">
              Add Articles
            </button>
            <button onClick={makeCard} className="buttons__btn">
              {gridTemplate === "30% 30% 30%"
                ? "Make small card"
                : "Make big card"}
            </button>
          </div>
        </div>
        <div style={styleColumns} className="articles">
          {arr}
        </div>
        <button className={showMoreBtn} onClick={showMore}>
          Show more
        </button>
      </>
    );
  }
}
