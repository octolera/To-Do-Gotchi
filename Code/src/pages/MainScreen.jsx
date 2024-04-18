import { useRef, useState } from "react";
import {
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { get, set } from "../data/IonicStorage";
import "./MainScreen.css";
import "./common.css";
import { useHistory } from "react-router";

const states = [
  {
    threshold: 66,
    animations: [
      {
        start: 6.3,
        duration: 5.5,
        priority: 70,
      },
      {
        start: 4.5,
        duration: 1.5,
        priority: 20,
      },
      {
        start: 0,
        duration: 4,
        priority: 10,
      },
    ],
  },
  {
    threshold: 33,
    animations: [
      {
        start: 11.8,
        duration: 5.8,
        priority: 10,
      },
      {
        start: 11.8,
        duration: 2.8,
        priority: 20,
      },
      {
        start: 17.6,
        duration: 3.4,
        priority: 70,
      },
    ],
  },
  {
    threshold: 0,
    animations: [
      {
        start: 22.7,
        duration: 4,
        priority: 30,
      },
      {
        start: 26.5,
        duration: 6,
        priority: 70,
      },
    ],
  },
];

/**
 *
 * @param {number} health
 * @returns {number} index of current pet state
 */
const healthToPetState = (health) => {
  const sortedStates = states.sort((a, b) => a.threshold > b.threshold);
  for (let i = 0; i < sortedStates.length; i++) {
    if (health >= sortedStates[i].threshold) {
      return i;
    }
  }
  return 0;
};
/**
 *
 * @param {number} max
 * @returns {number} random int in range [0..max)
 */
const randomInt = (max) => {
  return Math.floor(Math.random() * max);
};
/**
 *
 * @param {typeof states} weights
 * @returns {{threshold: number, animations: {start: number, duration: number, priority: number}[], }} weighted random state
 */
const weightedRandom = (weights) => {
  let sum = 0;
  weights.forEach((x) => {
    sum += x.priority;
  });
  let rnd = randomInt(Math.floor(sum));
  for (const x of weights) {
    if (rnd < x.priority) return x;
    rnd -= x.priority;
  }
  return weights[0];
};
let globalBlock = false;
let globalPetState = 0;
const MainScreen = () => {
  const history = useHistory();
  const [health, setHealth] = useState(100);
  const [petname, setPetname] = useState("");
  const [opacity, setOpacity] = useState(0);
  const [tasksCount, setTaskCount] = useState({ total: 0, checked: 0 });
  const [petOpaciy, setPetOpacity] = useState(1);
  const video = useRef();
  const playAnimation = (block = false) => {
    if (globalBlock && block) return;
    try {
      const s = weightedRandom(states[globalPetState].animations);
      video.current.currentTime = s.start;
      setTimeout(() => {
        playAnimation();
      }, s.duration * 1000);
    } catch (e) {
      return;
    }
    if (block) {
      globalBlock = true;
    }
  };
  const calcHealth = async () => {
    const regex = /([0-9]*)_([0-9]*)_([0-9]*)/;
    let total = 0;
    let checked = 0;
    let health = await get("_health");
    if (health == undefined) health = 100;
    let keys = await get("_keys");
    if (keys == undefined) keys = [];
    let newKeys = [...keys];
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    for (const [index, key] of keys.entries()) {
      const val = await get(key);
      if (val == undefined) {
        newKeys.splice(index, 1);
        continue;
      }
      const res = regex.exec(key);
      const date = new Date(res[3], res[2], res[1]);
      date.setHours(0, 0, 0, 0);
      const tasks = await get(key);
      if (tasks == undefined) {
        newKeys.splice(index, 1);
        continue;
      }
      if (date.getTime() == currentDate.getTime()) {
        total = tasks.length;
        tasks.forEach((e) => {
          if (e.check) checked++;
        });
        setTaskCount({ total: total, checked: checked });
      }
      if (date.getTime() < currentDate.getTime()) {
        const updated = [];
        tasks.forEach((e) => {
          if (e.check == false) {
            health -= 5;
          } else health += 2;

          updated.push({ name: e.name, status: "down", check: e.check });
        });
        if (health < 0) health = 0;
        if (health > 100) health = 100;
        set(key, updated);
        newKeys.splice(index, 1);
      }
    }
    set("_keys", newKeys);
    set("_health", health);
    if (health <= 0) {
      history.replace("/death-screen");
    }

    setHealth(health);
    globalPetState = healthToPetState(health);
  };
  useIonViewWillEnter(async () => {
    const fetchStore = async () => {
      const name = await get("_petname");
      await calcHealth();
      setPetname(name);
    };
    await fetchStore();
    setOpacity(1);
    playAnimation(1);
    setPetOpacity(undefined);
  }, []);
  useIonViewWillLeave(() => {
    setOpacity(0);
    setPetOpacity(0);
  });
  const tasksButton = () => {
    history.push("/tasks");
  };

  return (
    <IonPage id="main-screen">
      <div
        style={{
          transition: "opacity",
          transitionDuration: "300",
          opacity: opacity,
        }}
        id="main-container"
        className="common-container"
      >
        <div id="main-title">ToDoGotchi</div>
        <div data-testid="pet-name" id="pet-name">
          {petname}
        </div>
        <div id="pet-border">
          <video
            poster="/assets/pet-static/poster.webp"
            hidden={petOpaciy}
            id="animation"
            autoPlay={true}
            muted={true}
            ref={video}
            style={{ zIndex: 10, maxWidth: 300 }}
            preload="metadata"
          >
            <source src="/assets/pet-static/kepa.webm" type="video/webm" />
          </video>
        </div>
        <span id="health-bar">
          <p>Здоровье</p>
          <span id="health-percentage">
            <p style={{ width: "100%", textAlign: "end" }}>{health}%</p>
          </span>
        </span>
        <span id="task-counter">
          <p>Задачи</p>
          <span id="health-percentage">
            <p style={{ width: "100%", textAlign: "end" }}>
              {tasksCount.checked}/{tasksCount.total}
            </p>
          </span>
        </span>
        <button onClick={tasksButton} id="task-button" className="btn-inverse">
          Задания
        </button>
      </div>
    </IonPage>
  );
};

export default MainScreen;
