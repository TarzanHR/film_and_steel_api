import { Router } from "express";
import { getScenaristes, getScenaristeById, getScenaristeByName } from "./scenariste.controller";

export const scenaristeRouter = Router();

scenaristeRouter.get("/scenaristes", getScenaristes);
scenaristeRouter.get("/scenaristes/id/:scenariste_id", getScenaristeById);
scenaristeRouter.get("/scenaristes/name/:perso_name", getScenaristeByName);