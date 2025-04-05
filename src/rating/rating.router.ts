import { Router } from 'express'
import { getRating, getRatingById, createRating, updateRating, deleteRating } from './rating.controller'

export const ratingRouter = Router()

ratingRouter.get('/ratings', getRating)
ratingRouter.get('/ratings/:rating_id', getRatingById)
ratingRouter.post('/ratings', createRating)
ratingRouter.patch('/ratings/:rating_id', updateRating)
ratingRouter.delete('/ratings/:rating_id', deleteRating)
