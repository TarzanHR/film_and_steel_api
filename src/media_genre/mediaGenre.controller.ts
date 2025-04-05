import { Request, Response } from "express";
import prisma from "../client";

export const getMediaGenres = async (req: Request, res: Response) => {
  try {
    const mediaGenres = await prisma.media_genre.findMany();
    res.status(200).send(mediaGenres);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getMediaGenresByMediaId = async (req: Request, res: Response) => {
  try {
    const mediaId = req.params.media_id;

    if (!mediaId) {
      res.status(400).send({ error: "Media ID is required" });
    } else {
      const mediaGenres = await prisma.media_genre.findMany({
        where: {
          media_id: mediaId,
        },
      });

      res.status(200).send(mediaGenres);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getMediaGenresByGenreId = async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.genre_id);

    if (isNaN(genreId)) {
      res.status(400).send({ error: "Valid Genre ID is required" });
    } else {
      const mediaGenres = await prisma.media_genre.findMany({
        where: {
          genre_id: genreId,
        },
      });

      res.status(200).send(mediaGenres);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getMediaGenresByAll = async (req: Request, res: Response) => {
  try {
    const mediaId = req.params.media_id;
    const genreId = parseInt(req.params.genre_id);

    if (!mediaId || isNaN(genreId)) {
      res.status(400).send({ error: "Valid Media ID and Genre ID are required" });
    } else {
      const mediaGenre = await prisma.media_genre.findUnique({
        where: {
          media_id_genre_id: {
            media_id: mediaId,
            genre_id: genreId
          }
        },
        include: {
          genre: true
        }
      });

      if (!mediaGenre) {
        res.status(404).send({ error: "MediaGenre not found" });
      } else {
        res.status(200).send(mediaGenre);
      }
    }
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};