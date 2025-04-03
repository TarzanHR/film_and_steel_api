import { Router } from "express";
import {
  getPersonnes,
  getPersonneById,
  createPersonne,
  updatePersonne,
  deletePersonne,
  getPersonneByName,
} from "./personne.controller";

export const personneRouter = Router();

personneRouter.get("/personnes", getPersonnes);
personneRouter.get("/personnes/id/:perso_id", getPersonneById);
personneRouter.get("/personnes/name/:perso_name", getPersonneByName);
personneRouter.post("/personnes", createPersonne);
personneRouter.patch("/personnes/:perso_id", updatePersonne);
personneRouter.delete("/personnes/:perso_id", deletePersonne);
