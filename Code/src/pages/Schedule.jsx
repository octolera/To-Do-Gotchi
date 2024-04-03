import { useEffect, useRef, useState } from "react";

import {
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import "./common.css";
import "./Schedule.css";
import { Link } from "react-router-dom";
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
const weekdRU = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
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

function Schedule() {
  const inputRef = useRef();
  let currDate = new Date();
  const [month, setMonth] = useState(currDate.getMonth());
  const [monthTasks, setMonthTasks] = useState({});
  const [year, setYear] = useState(currDate.getFullYear());
  const [visibility, setVisibility] = useState("hidden");
  const [dropVisibility, setDropVisibility] = useState("hidden");
  const [dropParams, setDropParams] = useState("");

  const [isUpdated, setIsUpdated] = useState(false);
  const [menuDay, setMenuDay] = useState(0);
  const [menuWeekDay, setMenuWeekDay] = useState(0);
  const [repeat, setRepeat] = useState(false);

  /**
   * 
   * @param {number} weekd day of week
   * @param {number} day month day
   */
  const openMenu = (weekd, day) => {
    setMenuDay(day);
    setMenuWeekDay(weekd);
    setVisibility("visible");
  };
  const hideMenu = () => {
    inputRef.current.value = "";
    setVisibility("hidden");
  };
  const hideDrop = () => {
    setDropVisibility("hidden");
  };
  const getTasks = async () => {
    let len;
    if (month == 1 && year % 4 == 0) {
      len = 29;
    } else {
      len = monthLen[len];
    }
    const t = [];
    for (let i = 1; i <= len; i++) {
      let resp = await get(i + "_" + month + "_" + year);
      t.push(resp);
    }
    setMonthTasks({ ...t });
  };
  const TaskName = ({ name }) => <div id="text-task-underl">{name}</div>;

  const DayCard = ({ weekd, day, visibility, tasks, num }) => (
    <div id="day-card">
      <div id="text-card">
        <div id="day-card-title">
          <h1>
            {weekdRU[weekd]}, {day}
          </h1>
        </div>
        <button
          id="edit-button"
          onClick={() => {
            openMenu(weekd, num);
          }}
          style={{ visibility: visibility }}
          name={num}>
          +
        </button>
      </div>
      {tasks
        ? tasks.map((task, index) => (
            <div id="text-card">
              <TaskName key={index} name={task.name}></TaskName>
              <button
                id="edit-button"
                onClick={() => {
                  setDropParams({
                    name: task.name,
                    ind: index,
                    day: day,
                    weekd: weekd,
                  });
                  setDropVisibility("visible");
                }}
                style={{ visibility: visibility }}
                name={num}>
                -
              </button>
            </div>
          ))
        : null}
    </div>
  );
  const dropTask = async () => {
    const currTasks = await get(dropParams.day + "_" + month + "_" + year);
    currTasks.splice(dropParams.ind, 1);
    await set(dropParams.day + "_" + month + "_" + year, currTasks);
    setIsUpdated(true);
    setDropVisibility("hidden");
  };
  const DayCardList = () => {
    const components = [];
    const tasks = [];
    let weekDay = new Date(year, month, 0).getDay();
    if (month == 1 && year % 4 == 0) {
      for (var i = 0; i < 29; i++, weekDay++) {
        if (
          year > currDate.getFullYear() ||
          (month > currDate.getMonth() && year >= currDate.getFullYear()) ||
          (i + 1 >= currDate.getDate() &&
            month >= currDate.getMonth() &&
            year >= currDate.getFullYear())
        ) {
          components.push({
            weekd: weekDay % 7,
            day: i + 1,
            v: "visible",
            tasks: monthTasks[i],
            num: i,
          });
        } else {
          components.push({
            weekd: weekDay % 7,
            day: i + 1,
            v: "hidden",
            tasks: monthTasks[i],
            num: i,
          });
        }
      }
    } else {
      for (var i = 0; i < monthLen[month]; i++, weekDay++) {
        if (
          year > currDate.getFullYear() ||
          (month > currDate.getMonth() && year >= currDate.getFullYear()) ||
          (i + 1 >= currDate.getDate() &&
            month >= currDate.getMonth() &&
            year >= currDate.getFullYear())
        ) {
          components.push({
            weekd: weekDay % 7,
            day: i + 1,
            v: "visible",
            tasks: monthTasks[i],
            num: i,
          });
        } else {
          components.push({
            weekd: weekDay % 7,
            day: i + 1,
            v: "hidden",
            tasks: monthTasks[i],
            num: i,
          });
        }
      }
    }
    return (
      <div>
        {components.map((day, index) => (
          <DayCard
            key={index}
            weekd={day.weekd}
            day={day.day}
            visibility={day.v}
            tasks={day.tasks}
            num={day.num + 1}
          />
        ))}
      </div>
    );
  };
  useIonViewWillEnter(() => {
    getTasks();
  });
  const sideScrollForv = async () => {
    if (month >= 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setIsUpdated(true);
  };
  const sideScrollBack = async () => {
    if (month <= 0) {
      setMonth(() => 11);
      setYear((x) => x - 1);
    } else {
      setMonth((x) => x - 1);
    }
    setIsUpdated(true);
  };
  useEffect(() => {
    if (isUpdated) {
      getTasks();
    }
    setIsUpdated(false);
  }, [isUpdated]);
  const submitTask = async (e) => {
    e.preventDefault();
    const input = inputRef.current.value;
    if (input.length == 0 || input.length > 125) {
      return false;
    }
    const currTasks = await get(menuDay + "_" + month + "_" + year);
    if (currTasks) {
      currTasks.push({ name: input, status: "active" });
      await set(menuDay + "_" + month + "_" + year, currTasks);
    } else {
      await set(menuDay + "_" + month + "_" + year, [
        { name: input, status: "active" },
      ]);
    }
    setIsUpdated(true);
    hideMenu();
  };
  return (
    <IonPage id="schedule-screen">
      <div
        style={{
          transition: "opacity",
          transitionDuration: "300",
        }}
        id="sched-container"
        className="common-container">
        <div
          id="fill-color"
          style={{
            visibility:
              dropVisibility == "visible" ? dropVisibility : visibility,
          }}></div>
        <div id="popup-box" style={{ visibility: dropVisibility }}>
          <div id="popup-menu">
            <div id="btn-back-container">
              <Link
                id="create-back"
                onClick={hideDrop}
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

                <span style={{ userSelect: "none", cursor: "default" }}>
                  Назад
                </span>
              </Link>
              <div id="menu-container">
                <div id="title">Удалить задачу? </div>
                <div id="small-text">
                  {dropParams.day}, {weekdRUFull[dropParams.weekd]}
                </div>
                <div id="small-text">{dropParams.name}</div>
              </div>
            </div>
          </div>
          <button id="popup-button" onClick={dropTask}>
            Удалить
          </button>
        </div>
        <div id="popup-box" style={{ visibility: visibility }}>
          <div id="popup-menu">
            <div id="btn-back-container">
              <Link
                id="create-back"
                onClick={hideMenu}
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
                <span style={{ userSelect: "none", cursor: "default" }}>
                  Назад
                </span>
              </Link>
              <div id="menu-container">
                <div id="title">Задача</div>
                <div id="small-text">
                  {menuDay}, {weekdRUFull[menuWeekDay]}
                </div>
                <form id="taskname-form" onSubmit={submitTask}>
                  <textarea
                    id="taskname-input"
                    ref={inputRef}
                    maxLength={125}
                    placeholder="Название задачи..."
                  />
                </form>
                <div id="small-text">Повторять?</div>
                <div id="line-container">
                  <button
                    id="popup-button"
                    onClick={() => {
                      setRepeat(true);
                    }}>
                    Да
                  </button>
                  <button
                    id="popup-button"
                    onClick={() => {
                      setRepeat(false);
                    }}>
                    Нет
                  </button>
                </div>
                <div id="small-text">Повтор</div>
                <div id="line-container">
                  <button id="square-button">ПН</button>
                  <button id="square-button">ВТ</button>
                  <button id="square-button">СР</button>
                  <button id="square-button">ЧТ</button>
                  <button id="square-button">ПТ</button>
                  <button id="square-button">СБ</button>
                  <button id="square-button">ВС</button>
                </div>
              </div>
            </div>
          </div>
          <button id="popup-button" onClick={submitTask}>
            Создать
          </button>
        </div>
        <div id="sched-title">
          <h1>Календарь</h1>
        </div>
        <div id="sched-month">
          <button id="scroll-button" onClick={sideScrollBack}>
            -
          </button>
          <h1>
            {monthsRU[month]} {year}
          </h1>
          <button id="scroll-button" onClick={sideScrollForv}>
            +
          </button>
        </div>
        <div id="scrollable-container">
          <div id="scrollable-content">
            <DayCardList></DayCardList>
          </div>
        </div>
      </div>
    </IonPage>
  );
}

export default Schedule;
