import { Router } from 'express'
import { getCrews, getCrewById, createCrew } from './crew.controller'

export const crewRouter = Router()

crewRouter.get("/crews", getCrews);
crewRouter.get("/crews/id/:crew_id", getCrewById)
crewRouter.post("/crews", createCrew)