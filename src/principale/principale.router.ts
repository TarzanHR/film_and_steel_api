import { Router } from 'express'
import { getPrincipals, getPrincipalsByMediaId, getPrincipalsByPersonneId, createPrincipal, updatePrincipal, deletePrincipal } from './principale.controller'

export const principaleRouter = Router()

principaleRouter.get('/principales', getPrincipals)
principaleRouter.get('/principales/media/:media_id', getPrincipalsByMediaId)
principaleRouter.get('/principales/personne/:perso_id', getPrincipalsByPersonneId)
principaleRouter.post('/principales', createPrincipal)
principaleRouter.patch('/principales/:media_id/:perso_id', updatePrincipal)
principaleRouter.delete('/principales/:media_id/:perso_id', deletePrincipal)
