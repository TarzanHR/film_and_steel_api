import { Router } from "express";
import { getMedia, getMediaById, createMedia, updateMedia, deleteMedia, getMediaByName } from "./media.controller";

export const mediaRouter = Router();

mediaRouter.get("/medias", getMedia);
mediaRouter.get("/medias/id/:media_id", getMediaById);
mediaRouter.get("/medias/name/:primaryTitle", getMediaByName);
mediaRouter.post("/medias", createMedia);
mediaRouter.patch("/medias/:media_id", updateMedia);
mediaRouter.delete("/medias/:media_id", deleteMedia);
