import React, { useRef, useState, useEffect } from "react";

import "./users.scss";

import axios from "axios";

export function Users() {
  const [arrUsers, setUsers] = useState(getStoredState);
  const [modalInfo, setModalInfo] = useState("");
  const [countUsers, setCountUsers] = useState(3);
  const [modal, toogleModal] = useState("modal hidden");
  const [modalBackground, toogleModalBackground] = useState(
    "modalBackground hidden"
  );

  const [modalClose, toogleModalClose] = useState("modalClose hidden");
  const [lastId, setLastId] = useState(11);
  const [showMoreBtn, toogleShowMoreBtn] = useState("show-more-btn");
  const [gridTemplate, setGridTemplate] = useState("30% 30% 30%"); // количество статей в ряд

  const refEmailInput = useRef();
  const refNameInput = useRef();
  const refPhoneInput = useRef();
  const refUsernameInput = useRef();
  const refWebsiteInput = useRef();

  const styleColumns = {
    gridTemplateColumns: gridTemplate,
  };

  const styleUser = (id, idStyle) => {
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

  console.log("первый рендер");

  function getStoredState(count) {
    if (count > 10) {
      toogleShowMoreBtn("show-more-btn hidden");
    }

    let temp = axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then(function (response) {
        // handle success

        return response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    if (count === undefined) {
      temp.then((data) => {
        let arr = [];

        for (let i = 0; i < countUsers; i++) {
          let temp = styleUser(data[i].id);

          // заполнение articles divs *** пометка ***
          arr.push({
            id: data[i].id,
            address: data[i].address,
            company: data[i].company,
            email: data[i].email,
            name: data[i].name,
            phone: data[i].phone,
            username: data[i].username,
            website: data[i].website,
            idStyle: temp.id,
            color: temp.color,
            backgroundColor: temp.backgroundColor,
          });
        }

        // console.log(data);
        setUsers(arr);
      });
    } else {
      temp.then((data) => {
        let arr = [];

        for (let i = countUsers; i < (count > 10 ? 10 : count); i++) {
          // заполнение articles divs *** пометка ***
          let temp = styleUser(data[i].id);

          arr.push({
            id: data[i].id,
            address: data[i].address,
            company: data[i].company,
            email: data[i].email,
            name: data[i].name,
            phone: data[i].phone,
            username: data[i].username,
            website: data[i].website,
            idStyle: temp.id,
            color: temp.color,
            backgroundColor: temp.backgroundColor,
          });
        }

        // console.log(data);
        setUsers((arrUsers) => {
          let temp = [...arrUsers, ...arr];
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

  async function addUserForm() {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    let modalTemp = {};

    modalTemp = (
      <>
        <label>Name: </label>
        <input ref={refNameInput} type="text" />
        <label>Email: </label>
        <input ref={refEmailInput} type="email" />
        <label>Phone: </label>
        <input ref={refPhoneInput} type="phone" />
        <label>Username: </label>
        <input ref={refUsernameInput} type="text" />
        <label>Website: </label>
        <input ref={refWebsiteInput} type="text" />
        <button onClick={() => addUser()}>Create</button>
      </>
    );

    async function addUser() {
      toogleModal("modal hidden");
      toogleModalBackground("modalBackground hidden");
      toogleModalClose("modalClose hidden");

      await setUsers((value) => {
        let arr = [];
        let tempStyle = styleUser(lastId);

        let temp = {
          id: lastId,
          email: refEmailInput.current.value,
          name: refNameInput.current.value,
          phone: refPhoneInput.current.value,
          username: refUsernameInput.current.value,
          website: refWebsiteInput.current.value,
          idStyle: tempStyle.id,
          color: tempStyle.color,
          backgroundColor: tempStyle.backgroundColor,
        };

        value.map((value, index) => {
          arr.push(value);
        });

        arr.push(temp);

        return arr;
      });

      setLastId((value) => value + 1);
    }

    console.log(modalTemp);

    setModalInfo(modalTemp);
  }

  async function updateUsers(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    setUsers((value) => {
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
              <button onClick={() => changeUser(value.id)}>Update</button>
            </>
          );
        }
      });

      console.log(modalTemp);

      setModalInfo(modalTemp);

      return value;
    });
  }

  function deleteUsers(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    let modalTemp = (
      <>
        <label>Вы действительно хотите удалить эту запись?</label>
        <button onClick={() => deleteUser(true)}>Да</button>
        <button onClick={() => closeModal(false)}>Нет</button>
      </>
    );

    setModalInfo(modalTemp);

    let deleteUser = () => {
      setUsers((value) => {
        let arr = [];

        value.map((value) => {
          if (Number(value.id) === id) {
          } else {
            arr.push(value);
          }
        });

        console.log(arr);

        return arr;
      });

      closeModal();
    };
  }

  function changeColor(id) {
    let arr = arrUsers.map((value, index) => {
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

        let tempStyle = styleUser(value.id, tempId);

        console.log(tempStyle);

        let currentUser = {
          id: value[i].id,
          address: value[i].address,
          company: value[i].company,
          email: value[i].email,
          name: value[i].name,
          phone: value[i].phone,
          username: value[i].username,
          website: value[i].website,
          idStyle: tempStyle.id,
          color: tempStyle.color,
          backgroundColor: tempStyle.backgroundColor,
        };
        return currentUser;
      } else {
        return value;
      }
    });
    setUsers(arr);
  }

  function showUser(id) {
    toogleModal("modal");
    toogleModalBackground("modalBackground");
    toogleModalClose("modalClose");

    setUsers((value) => {
      let modalTemp = {};

      value.map((value) => {
        if (Number(value.id) === id) {
          modalTemp = (
            <>
              <p>Name: {value.name}</p>
              <p>Username: {value.username}</p>
              <p>Email: {value.email}</p>
              <p>Phone: {value.phone}</p>
              <p>Website: {value.website}</p>
              {/* <p>Adress: {value.adress}</p> */}
              {/* <p>Company: {value.company}</p> */}
            </>
          );
          console.log(value.address);
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
    await setCountUsers((value) => {
      console.log(value);
      return value + 3;
    });

    let currentCount = "";

    await setCountUsers((value) => {
      currentCount = value;
      return value;
    });

    console.log(currentCount);
    getStoredState(currentCount);
  }

  const changeUser = (id) => {
    toogleModal("modal hidden");
    toogleModalBackground("modalBackground hidden");
    toogleModalClose("modalClose hidden");
    setModalInfo("");

    console.log(refInput.current.value);
    console.log(refTextarea.current.value);

    setUsers((value) => {
      let modalTemp = {};
      let q = "";

      modalTemp = value.map((value) => {
        if (Number(value.id) === id) {
          return (q = {
            // title: refInput.current.value,
            // body: refTextarea.current.value,

            // ************* тут изменить
            id: value[i].id,
            address: value[i].address,
            company: value[i].company,
            email: value[i].email,
            name: value[i].name,
            phone: value[i].phone,
            username: value[i].username,
            website: value[i].website,
            idStyle: value.idStyle,
            color: value.color,
            backgroundColor: value.backgroundColor,
          });
        } else {
          return value;
        }
      });

      return modalTemp;
    });
  };

  const styleColorBackground = (color, background) => {
    let temp = {
      color: color,
      backgroundColor: background,
    };

    return temp;
  };

  if (arrUsers !== undefined) {
    let arr = [];

    for (let i = 0; i < arrUsers.length; i++) {
      arr.push(
        <div
          style={styleColorBackground(
            arrUsers[i].color,
            arrUsers[i].backgroundColor
          )}
          className="article"
          key={i}
        >
          <div>
            <p>Name: {arrUsers[i].name}</p>
            <p>Email: {arrUsers[i].email}</p>
            <p>Phone: {arrUsers[i].phone}</p>
          </div>
          <div className="articles__buttons">
            <button
              onClick={() => {
                showUser(arrUsers[i].id);
              }}
              className="articles__buttons-btn"
            >
              Show
            </button>
            <button
              onClick={() => {
                deleteUsers(arrUsers[i].id);
              }}
              className="articles__buttons-btn"
            >
              Delete
            </button>
            <button
              onClick={() => {
                updateUsers(arrUsers[i].id);
              }}
              className="articles__buttons-btn"
            >
              Edit
            </button>
            <button
              onClick={() => {
                changeColor(arrUsers[i].id);
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
          <h1>Users List</h1>
          <div className="buttons">
            <button onClick={addUserForm} className="buttons__btn">
              Add User
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
  // arrUsers !== undefined ? console.log(arrUsers[0]) : "";
}
