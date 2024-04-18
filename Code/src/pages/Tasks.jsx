import { useRef, useState, useEffect } from "react";
import {
  IonPage,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import "./common.css";
import "./Tasks.css";

import { useHistory } from "react-router";
import { set, get } from "../data/IonicStorage";

const monthsRU = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];
const weekdRU = [ "вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const weekdRUFull = [
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
  "воскресенье",
];
const monthLen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function Tasks() {
    const inputRef = useRef();
    const history = useHistory();
    let currDate = new Date();
    const [month, setMonth] = useState(currDate.getMonth());
    const [year, setYear] = useState(currDate.getFullYear());
    const [day, setDay] = useState(currDate.getDate());
    const [weekD, setWeekD] = useState(currDate.getDay());
    const [today, setToday] = useState(true)
    const [tasks, setTasks] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const sideScrollBack = () => {
      if(day == 1){
      if (month <= 0) {
        setMonth(() => 11);
        setYear((x) => x - 1);
      } else {
        setMonth((x) => x - 1);
      }
      setDay(monthLen[month]);
      if(month == 1 && year%4 == 0){
        setDay(29);month == 1 && year%4 == 0
      }} else {
        setDay(day - 1);
      }
      setWeekD(weekD == 0 ? 6 : weekD - 1)
      setIsUpdated(true);
    }
    const sideScrollForv = () => {
      if(day >= monthLen[month] && !((year % 4 == 1 && month == 1)&& day == 28)){
      if (month >= 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
      setDay(1);
      }else{
        setDay(day + 1);
      }
      setWeekD((weekD + 1) % 6)
      setIsUpdated(true);
    }
    const openSchedule = () => {
      history.push("/schedule");
    }
   const getTasks = async () => {
       let resp = await get(day + "_" + month + "_" + year);
       setTasks(resp);
     };
   const TaskCard = ({task, id}) => {
      let opt = []
      if(today){
       task.check? opt="circle" : opt="circle-nofill";}else{
        task.check?  opt="circle-fade" : opt="circle-nofill-fade";
       }
       if(task.status == "active" && today){
          return(
              <div name={id} id={"t_"+ id + "_" + (task.check? "1":"0")} className="card clickable" onClick={changeStatus}>
                  <div id="card-title">{task.name}</div>
                  <div id={opt}></div>
              </div>
          );}
        return(
            <div className="card" >
                <div id="card-title"><h1>{task.name}</h1></div>
                <div id={opt}></div>
            </div>
            );
  };
  const TaskList = () => {
    if(tasks){
       return(<div>
           {tasks? tasks.map((t, ind) => (
             <TaskCard 
                key = {ind}
               task={t}
               id={ind}
             />
           ) ): Null}
         </div>);};
   };
  const changeStatus = async(e) => {
    let id = e.currentTarget.id.split("_");
    if(id[0] == "t"){
      let n = parseInt(id[1]);
      if(tasks[n]){
        tasks[n].check = (tasks[n].check == false?true:false);
        await set(day + "_" + month + "_" + year, tasks);
        getTasks();
      }
    }
  }
  useIonViewWillEnter(() => {
    getTasks();
    setToday(true);
  });
  useEffect(() => {
    if (isUpdated) {
      if(year == currDate.getFullYear() && month == currDate.getMonth() && day == currDate.getDate() ){
        setToday(true)
      }else{
        setToday(false)
      }
      getTasks();
    }
    setIsUpdated(false);
  }, [isUpdated]);

  return (
    <IonPage id="screen">
      <div
        style={{
          transition: "opacity",
          transitionDuration: "300",
        }}
        id="task-container"
        className="common-container">
        <div id="sched-title">
          <h1>Задачи</h1>
        </div>
        <div id="scroll-top">
          <button id="scroll-button" onClick={sideScrollBack}>
            -
          </button>
          <h1>
            {monthsRU[month]} {day}, {weekdRU[weekD]}
          </h1>
          <button id="scroll-button" onClick={sideScrollForv}>
            +
          </button>
        </div>
        <div id="scrollable-container">
          <TaskList></TaskList>
        </div>
        <button onClick={openSchedule} id="task-button" className="btn-inverse">
          Календарь
        </button>
      </div>
    </IonPage>
  );
};

export default Tasks;