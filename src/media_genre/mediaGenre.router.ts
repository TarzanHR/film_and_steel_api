import { Router } from 'express'
import { getMediaGenres, getMediaGenresByAll, getMediaGenresByGenreId, getMediaGenresByMediaId } from './mediaGenre.controller'

export const mediaGenreRouter = Router()

mediaGenreRouter.get('/mediaGenres', getMediaGenres)
mediaGenreRouter.get("/mediaGenres/media/:media_id", getMediaGenresByMediaId)
mediaGenreRouter.get("/mediaGenres/genre/:genre_id", getMediaGenresByGenreId)
mediaGenreRouter.get("/mediaGenres/:media_id/:genre_id", getMediaGenresByAll)