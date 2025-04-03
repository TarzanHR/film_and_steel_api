import { Router } from "express";
import { getGenres, createGenre, updateGenre, deleteGenre, getGenreById, getGenreByName } from "./genre.controller";

export const genreRouter = Router();

genreRouter.get("/genres", getGenres);
genreRouter.get("/genre/id/:genre_id", getGenreById);
genreRouter.get("/genre/name/:genre_name", getGenreByName);
genreRouter.post("/genres", createGenre);
genreRouter.patch("/genres/:genre_id", updateGenre);
genreRouter.delete("/genres/:genre_id", deleteGenre);
