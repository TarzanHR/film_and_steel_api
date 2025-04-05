import { Router } from "express";
import { getCrewDirecteurs, getCrewsByDirecteur, getDirecteursByCrew } from "./crew_directeur.controller";

export const crewDirecteurRouter = Router();

crewDirecteurRouter.get("/crew_directeurs", getCrewDirecteurs)
crewDirecteurRouter.get("/crew_directeurs/directeur/:directeur_id", getCrewsByDirecteur)
crewDirecteurRouter.get("/crew_directeurs/crew/:crew_id", getDirecteursByCrew)