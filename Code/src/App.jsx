import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
/*
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
*/
/* Theme variables */
import "./theme/variables.css";
import Username from "./pages/Username";
import PetName from "./pages/PetName";
import Fetch from "./pages/Fetch";
import MainScreen from "./pages/MainScreen";
import DeathScreen from "./pages/DeathScreen";
import Schedule from "./pages/Schedule";
import Tasks from "./pages/Tasks";
import { useEffect } from "react";
import { createStore } from "./data/IonicStorage";

setupIonicReact();

const App = () => {
  useEffect(() => {
    const setupStore = async () => {
      await createStore("UserData");
    };
    setupStore();
  });
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Fetch />
          </Route>
          <Route path="/petname" exact={true}>
            <PetName />
          </Route>
          <Route path="/username" exact={true}>
            <Username />
          </Route>
          <Route path="/main-screen" exact={true}>
            <MainScreen />
          </Route>
          <Route path="/death-screen" exact={true}>
            <DeathScreen />
          </Route>
          <Route path="/schedule" exact={true}>
            <Schedule />
          </Route>
          <Route path="/tasks" exact={true}>
            <Tasks />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
