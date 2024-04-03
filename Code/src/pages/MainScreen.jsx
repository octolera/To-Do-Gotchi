import {  useRef, useState } from "react";
import {
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import {get } from "../data/IonicStorage";
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
const healthToPetState = (health) =>{
  const sortedStates = states.sort((a,b)=> a.threshold > b.threshold);
  for(let i=0;i<sortedStates.length;i++){
    if( health >=sortedStates[i].threshold){ 
      return i;
    }
  }
  return 0;
} 
/**
 * 
 * @param {number} max 
 * @returns {number} random int in range [0..max)
 */
const randomInt = (max) =>{
  return Math.floor(Math.random() * max);
}
/**
 * 
 * @param {typeof states} weights 
 * @returns {{threshold: number, animations: {start: number, duration: number, priority: number}[], }} weighted random state
 */
const weightedRandom = (weights) => {
  let sum = 0;
  weights.forEach(x => {sum+=x.priority});
  let rnd = randomInt(Math.floor(sum));
  for (const x of weights){
    if(rnd < x.priority) return x;
    rnd -= x.priority;
  }
  return weights[0];
}
let globalBlock =false;
let globalPetState = 0;
const MainScreen = () => {

  const history = useHistory();
  const [health, setHealth] = useState(10);
  const [petname, setPetname] = useState("");
  const [opacity, setOpacity] = useState(0);
  const video = useRef();
  const playAnimation = (block=false) =>{
    if(globalBlock && block) return;
    try {
    const s = weightedRandom(states[globalPetState].animations);
    video.current.currentTime = s.start;
    setTimeout(()=>{
      playAnimation();
    },s.duration*1000)
  }catch(e){
    return;
  }
    if(block){
      globalBlock =true;
    }
  }
  useIonViewWillEnter(() => {
    const fetchStore = async () => {
      const name = await get("_petname");
      setPetname(name);
    };
    globalPetState = healthToPetState(health);
    fetchStore();
    setOpacity(1);
    playAnimation(1);
    //
  },[]);
  useIonViewWillLeave(() => {
    setOpacity(0);
  });
  const testClick = () => {
    setHealth((x) => (x >= 100 ? 0 : x + 10));
    globalPetState = healthToPetState(health +10);
    if (health + 10 > 100) {
      history.replace("/death-screen");
    }
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
        className="common-container">
        <div id="main-title">ToDoGotchi</div>
        <div data-testid="pet-name" id="pet-name">
          {petname}
        </div>
        <div id="pet-border">
          <video
            id="animation"
            autoPlay={true}
            muted={true}
            ref={video}
            style={{ zIndex: 10, maxWidth: 300 }}
            preload="metadata">
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
            <p style={{ width: "100%", textAlign: "end" }}>2/5</p>
          </span>
        </span>
        <button onClick={testClick} id="task-button" className="btn-inverse">
          Задания
        </button>
      </div>
    </IonPage>
  );
};

export default MainScreen;
