import { Router } from "express";
import { getDirecteurs, getDirecteurById, getDirecteurByName } from "./directeur.controller";

export const directeurRouter = Router();

directeurRouter.get("/directeurs", getDirecteurs);
directeurRouter.get("/directeurs/id/:directeur_id", getDirecteurById);
directeurRouter.get("/directeurs/name/:perso_name", getDirecteurByName);