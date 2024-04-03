import { useEffect, Fragment } from "react";
import { useHistory } from "react-router";
import {  get, set } from "../data/IonicStorage";

function Fetch() {
  const history = useHistory();
  useEffect(() => {
    const setupStore = async () => {
      if (!(await get("_dead"))) {
        await set("_dead", false);
      }
      const dead = await get("_dead");
      if (dead) {
        history.replace("/death-screen");
        return;
      }
      if (!(await get("_username"))) {
        history.replace("/username");
        return;
      }
      if (!(await get("_petname"))) {
        history.replace("/petname");
        return;
      }
      history.replace("/main-screen");
    };
    setupStore();
  }, []);
  return <Fragment />;
}

export default Fetch;
