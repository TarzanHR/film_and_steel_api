import { Router } from "express";
import { getCrewScenaristes, getCrewsByScenariste, getScenaristesByCrew } from "./crew_scenariste.controller";

export const crewScenaristeRouter = Router();

crewScenaristeRouter.get("/crew_scenaristes", getCrewScenaristes)
crewScenaristeRouter.get("/crew_scenariste/scenariste/:scenariste_id", getCrewsByScenariste)
crewScenaristeRouter.get("/crew_scenariste/crew/:crew_id", getScenaristesByCrew)