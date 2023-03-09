import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  photosAllAdd,
  photosAdd,
  photosEdit,
  photosDelete,
} from "../photos/photosSlice";

import "./photos.scss";

import axios from "axios";

let temp = axios
  .get("https://jsonplaceholder.typicode.com/photos")
  .then(function (response) {
    // handle success

    return response.data;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

export function Photos() {
  const [arrPhotos, setPhotos] = useState(getStoredState);
  const [modalInfo, setModalInfo] = useState("");
  const [countPhotos, setCountPhotos] = useState(3);
  const [modal, toogleModal] = useState("modal hidden");
  const [modalBackground, toogleModalBackground] = useState(
    "modalBackground hidden"
  );

  const [modalClose, toogleModalClose] = useState("modalClose hidden");
  const [lastId, setLastId] = useState(5000);
  const [showMoreBtn, toogleShowMoreBtn] = useState("show-more-btn");
  const [gridTemplate, setGridTemplate] = useState("30% 30% 30%"); // количество статей в ряд

  const refTitleInput = useRef();
  const refUrlInput = useRef();
  const refInputLink = useRef();

  const dispatch = useDispatch();
  const photosSelector = useSelector((state) => state.photos.photos);

  const styleColumns = {
    gridTemplateColumns: gridTemplate,
  };

  const stylePhoto = (id, idStyle) => {
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
    if (count > 4999) {
      toogleShowMoreBtn("show-more-btn hidden");
    }

    if (count === undefined) {
      temp.then((data) => {
        let arr = [];

        for (let i = 0; i < countPhotos; i++) {
          let temp = stylePhoto(data[i].id);

          // заполнение articles divs *** пометка ***
          arr.push({
            albumId: data[i].albumId,
            id: data[i].id,
            thumbnailUrl: data[i].thumbnailUrl,
            title: data[i].title,
            url: data[i].url,
            idStyle: temp.id,
            color: temp.color,
            backgroundColor: temp.backgroundColor,
          });
        }

        if (photosSelector[0] === undefined || photosSelector[0].length === 0) {
          setPhotos(arr);
          dispatch(photosAllAdd(arr));
        }
        // console.log(data);
      });
    } else {
      temp.then((data) => {
        let arr = [];

        for (let i = countPhotos; i < (count > 4999 ? 5000 : count); i++) {
          // заполнение articles divs *** пометка ***
          let temp = stylePhoto(data[i].id);

          arr.push({
            albumId: data[i].albumId,
            id: data[i].id,
            thumbnailUrl: data[i].thumbnailUrl,
            title: data[i].title,
            url: data[i].url,
            idStyle: temp.id,
            color: temp.color,
            backgroundColor: temp.backgroundColor,
          });
        }

        // console.log(data);
        setPhotos((arrPhotos) => {
          let temp = [...arrPhotos, ...arr];

          dispatch(photosAllAdd(temp));

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

  useEffect(() => {
    setPhotos(photosSelector[0]);
  }, [photosSelector]);

  async function addPhotoForm() {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    let modalTemp = {};

    modalTemp = (
      <>
        <label>title: </label>
        <input ref={refTitleInput} type="text" />
        <label>url: </label>
        <input ref={refUrlInput} type="email" />

        <button onClick={() => addPhoto()}>Create</button>
      </>
    );

    async function addPhoto() {
      toogleModal("modal hidden");
      toogleModalBackground("modalBackground hidden");
      toogleModalClose("modalClose hidden");

      const { id, color, backgroundColor } = stylePhoto();

      let temp = {
        id: lastId,
        title: refTitleInput.current.value,
        url: refUrlInput.current.value,
        idStyle: id,
        color: color,
        backgroundColor: backgroundColor,
      };

      dispatch(photosAdd(temp));

      setLastId((value) => value + 1);
    }

    console.log(modalTemp);

    setModalInfo(modalTemp);
  }

  async function updatePhoto(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    setPhotos((value) => {
      let modalTemp = {};

      value.map((value) => {
        if (Number(value.id) === id) {
          modalTemp = (
            <>
              <label>Title: </label>
              <input
                defaultValue={value.title}
                ref={refTitleInput}
                type="text"
              />
              <label>Photo: </label>
              <img src={value.url} alt="photo" />
              <label>Ссылка на фото</label>
              <input ref={refInputLink} type="text" />
              <input type="submit" onClick={() => changePhoto(value.id)} />
            </>
          );
        }
      });

      setModalInfo(modalTemp);

      return value;
    });
  }

  function deletePhotos(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    let modalTemp = (
      <>
        <label>Вы действительно хотите удалить эту запись?</label>
        <button onClick={() => deletePhoto(id)}>Да</button>
        <button onClick={() => closeModal(false)}>Нет</button>
      </>
    );

    setModalInfo(modalTemp);

    let deletePhoto = (id) => {
      dispatch(photosDelete({ id }));

      closeModal();
    };
  }

  function changeColor(id) {
    let arr = arrPhotos.map((value, index) => {
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
        console.log(value);

        let tempStyle = stylePhoto(value.id, tempId);

        console.log(tempStyle);

        let currentPhoto = {
          id: value.id,
          title: value.title,
          url: value.url,
          idStyle: tempStyle.id,
          color: tempStyle.color,
          backgroundColor: tempStyle.backgroundColor,
        };
        return currentPhoto;
      } else {
        return value;
      }
    });
    setPhotos(arr);
  }

  function showPhoto(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    setPhotos((value) => {
      let modalTemp = {};

      value.map((value) => {
        if (Number(value.id) === id) {
          modalTemp = (
            <>
              <p>Title: {value.title}</p>
              <img src={value.url} alt="photo" />
            </>
          );
          console.log(value.address);
        }
      });

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
    await setCountPhotos((value) => {
      console.log(value);
      return value + 3;
    });

    let currentCount = "";

    await setCountPhotos((value) => {
      currentCount = value;
      return value;
    });

    console.log(currentCount);
    getStoredState(currentCount);
  }

  const changePhoto = (id) => {
    toogleModal("modal hidden");
    toogleModalBackground("modalBackground hidden");
    toogleModalClose("modalClose hidden");
    setModalInfo("");

    console.log();

    arrPhotos.map((value) => {
      if (Number(value.id) === id) {
        let temp = {
          id: value.id,
          title: refTitleInput.current.value,
          url: refInputLink.current.value,
          idStyle: value.idStyle,
          color: value.color,
          backgroundColor: value.backgroundColor,
        };

        dispatch(photosEdit(temp));
      }
    });
  };

  const styleColorBackground = (color, background) => {
    let temp = {
      color: color,
      backgroundColor: background,
    };

    return temp;
  };

  if (arrPhotos !== undefined) {
    let arr = [];

    for (let i = 0; i < arrPhotos.length; i++) {
      // console.log(arrPhotos)
      arr.push(
        <div
          style={styleColorBackground(
            arrPhotos[i].color,
            arrPhotos[i].backgroundColor
          )}
          className="article"
          key={i}
        >
          <div className="form-photo">
            <p>Title: {arrPhotos[i].title}</p>
            <img className="photo" src={arrPhotos[i].url} alt="photo" />
          </div>
          <div className="articles__buttons">
            <button
              onClick={() => {
                showPhoto(arrPhotos[i].id);
              }}
              className="articles__buttons-btn"
            >
              Show
            </button>
            <button
              onClick={() => {
                deletePhotos(arrPhotos[i].id);
              }}
              className="articles__buttons-btn"
            >
              Delete
            </button>
            <button
              onClick={() => {
                updatePhoto(arrPhotos[i].id);
              }}
              className="articles__buttons-btn"
            >
              Edit
            </button>
            <button
              onClick={() => {
                changeColor(arrPhotos[i].id);
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
          <h1>Photos List</h1>
          <div className="buttons">
            <button onClick={addPhotoForm} className="buttons__btn">
              Add Photo
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
  // arrPhotos !== undefined ? console.log(arrPhotos[0]) : "";
}
