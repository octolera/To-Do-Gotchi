import { useState } from "react";
import { set, get, clear } from "../data/IonicStorage";
import {
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";

import "./DeathScreen.css";
import "./common.css";
import { useHistory } from "react-router";

function DeathScreen() {
  const history = useHistory();
  const [opacity, setOpacity] = useState(0);
  const [daysSurvived, setDaysSurvived] = useState(0);
  useIonViewWillEnter(async () => {
    const load = async () => {
      const date = new Date();
      if (!(await get("_dead"))) await set("_dead", true);
      const start = await get("_start");
      const startTime = Date.parse(start);
      const diff = Math.floor(
        (date.getTime() - startTime) / (1000 * 3600 * 24)
      );
      setDaysSurvived(diff > 0 ? diff : 0);
    };
    await load();
    setOpacity(1);
  });
  useIonViewWillLeave(() => {
    setOpacity(0);
  });
  const restart = async () => {
    const username = await get("_username");
    await clear();
    set("_username", username);
    history.replace("/");
  };
  return (
    <IonPage id="death-screen">
      <div
        style={{
          transition: "opacity",
          transitionDuration: "100ms",
          opacity: opacity,
        }}
        className="common-container"
      >
        <p id="death-header">
          не откладывай на завтра то, что можешь сделать послезавтра
        </p>
        <div id="death-container">
          <img src="/assets/pet-static/kepa-dead.webp" />
          <h1 id="death-title">Побеждён дедлайном</h1>
          <p id="death-stat">Пройдено: {daysSurvived} дней</p>
          <button id="death-screen-button" onClick={restart} className="btn">
            Начать заного
          </button>
        </div>
      </div>
    </IonPage>
  );
}

export default DeathScreen;
