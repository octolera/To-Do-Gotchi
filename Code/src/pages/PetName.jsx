import { useRef, useState } from "react";
import {
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import "./common.css";
import "./PetName.css";
import { Link, useHistory } from "react-router-dom";
import { set, get } from "../data/IonicStorage";
function PetName() {
  const inputRef = useRef();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [opacity, setOpacity] = useState(0);
  const [invitation, setInvitation] = useState(true);
  useIonViewWillEnter(() => {
    const fetchStore = async () => {
      const user = await get("_username");
      if (!user) {
        history.push("/username");
      }
      setUsername(user);
    };
    fetchStore();
    setOpacity(1);
  });
  useIonViewWillLeave(() => {
    setOpacity(0);
  });

  /**
 * @param {Event} e submit event
 */
  const submitName = async (e) => {
    e.preventDefault();
    /**@type {string} */
    const petname = inputRef.current.value;
    if (petname.length == 0 || petname.length > 20) {
      setInvitation(false);
      return false;
    }
    /**@type {string} */
    const pet = await get("_petname");
    if (pet != petname) {
      await set("_petname", petname);
    }
    history.replace("/");
    return false;
  };
  return (
    <IonPage id="petname-screen">
      <div
        style={{
          transition: "opacity",
          transitionDuration: "300",
          opacity: opacity,
        }}
        className="common-container">
        <div id="petname-btn-back-container">
          <Link
            id="petname-back"
            to="/username"
            style={{ width: "fit-content" }}
            className="btn-back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none">
              <path
                d="M0.939341 10.9393C0.353554 11.5251 0.353554 12.4749 0.939341 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939341 10.9393ZM22 10.5L2 10.5V13.5L22 13.5V10.5Z"
                fill="black"
              />
            </svg>
            <span style={{ userSelect: "none", cursor: "default" }}>Назад</span>
          </Link>
        </div>
        <div style={{ position: "relative" }} className="action-container">
          <img
            id="petname-egg"
            height="319"
            width="319"
            style={{
              position: "absolute",
              bottom: "-85px",
              left: "-55px",
              zIndex: "120",
              minWidth: "319px",
            }}
            src="/assets/pet-static/egg.webp"
          />
          <svg
            id="petname-shadow"
            xmlns="http://www.w3.org/2000/svg"
            width="204"
            height="64"
            viewBox="0 0 204 64"
            fill="none">
            <ellipse cx="102" cy="32" rx="102" ry="32" fill="currentColor" />
          </svg>
        </div>
        <span id="petname-container">
          <p id="petname-invitation">
            {invitation
              ? `Привет, ${username}! Теперь дай имя своему питомцу:`
              : `${username}, попробуй в этот раз чуть получше:`}
          </p>
          <form onSubmit={submitName} id="petname-form">
            <input
              id="petname-input"
              ref={inputRef}
              maxLength={25}
              placeholder="Имя питомца"
              className="inp-field"
            />
            <button id="petname-button" onClick={submitName} className="btn">
              Готово!
            </button>
          </form>
        </span>
      </div>
    </IonPage>
  );
}

export default PetName;
