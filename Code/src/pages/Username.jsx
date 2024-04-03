import { useRef, useState } from "react";
import {
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import "./common.css";
import "./Username.css";
import { useHistory } from "react-router";
import { set, get } from "../data/IonicStorage";

const invitationText = {
  normal: "Привет, меня зовут...",
  error: "Попробуй еще раз...",
};
function Username() {
  const [invitation, setInvitation] = useState("normal");
  const [opacity, setOpacity] = useState(0);
  const history = useHistory();
  const inputRef = useRef();
  useIonViewWillEnter(() => {
    const fetchStore = async () => {
      const user = await get("_username");
      if (user) inputRef.current.value = user;
    };
    fetchStore();
    setOpacity(1);
  }, []);
  useIonViewWillLeave(() => {
    setOpacity(0);
  });
  /**
   * 
   * @param {Event} e some js event
   * @returns 
   */
  const submitName = async (e) => {
    e.preventDefault();
    /**@type {string} */
    const username = inputRef.current.value;
    if (username.length == 0 || username.length > 20) {
      setInvitation("error");
      return false;
    }
    /**@type {string} */
    const user = await get("_username");
    if (user != username) {
      await set("_username", username);
    }
    history.push("/petname");
    return false;
  };

  return (
    <IonPage id="username-screen">
      <div
        style={{
          transition: "opacity",
          transitionDuration: "300",
          opacity: opacity,
        }}
        id="username-wrapper"
        className="common-container">
        <h1 id="username-header">ToDoGotchi</h1>
        <span id="username-container">
          <p id="username-invitation">{invitationText[invitation]}</p>
          <form id="username-form" onSubmit={submitName}>
            <input
              id="username-input"
              ref={inputRef}
              maxLength={25}
              placeholder="Моё имя"
              className="inp-field"
            />
            <button id="username-button" onClick={submitName} className="btn">
              Далее
            </button>
          </form>
        </span>
      </div>
    </IonPage>
  );
}

export default Username;
