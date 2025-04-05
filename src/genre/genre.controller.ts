import { Request, Response } from "express";
import prisma from "../client";

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prisma.genre.findMany();
    res.status(200).send(genres);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getGenreById = async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.genre_id);

    if (isNaN(genreId)) {
      res.status(400).send({ error: "Invalid genre ID" });
    } else {
      const genre = await prisma.genre.findUnique({
        where: {
          genre_id: genreId,
        },
      });
      
      if (!genre) {
        res.status(404).send({ error: "Genre not found" });
      } else {
        res.status(200).send(genre);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export const getGenreByName = async (req: Request, res: Response) => {
  try {
    const genreName = String(req.params.genre_name);

    const genre = await prisma.genre.findFirst({
      where: {
        genre_name: {
          equals: genreName,
          mode: 'insensitive' 
        }
      }
    });

    if (!genre) {
      res.status(404).send({ error: "Genre not found" });
    } else {
      res.status(200).send(genre);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export const createGenre = async (req: Request, res: Response) => {
  try {
    const { genre_id, genre_name } = req.body;

    if (!genre_name) {
      res.status(400).send({ error: "Genre name is required" });
    } else {
      let id = genre_id;
      if (!id) {
        const maxGenre = await prisma.genre.findFirst({
          orderBy: {
            genre_id: "desc",
          },
        });
        id = maxGenre ? maxGenre.genre_id + 1 : 1;
      }

      const genre = await prisma.genre.create({
        data: {
          genre_id: id,
          genre_name,
        },
      });

      res.status(201).send(genre);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updateGenre = async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.genre_id);
    const { genre_name } = req.body;

    if (isNaN(genreId)) {
      res.status(400).send({ error: "Invalid genre ID" });
    } else if (!genre_name) {
      res.status(400).send({ error: "Genre name is required" });
    } else {
      const existingGenre = await prisma.genre.findUnique({
        where: {
          genre_id: genreId,
        },
      });

      if (!existingGenre) {
        res.status(404).send({ error: "Genre not found" });
      } else {
        const genre = await prisma.genre.update({
          where: {
            genre_id: genreId,
          },
          data: {
            genre_name,
          },
        });

        res.status(200).send(genre);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.genre_id);

    if (isNaN(genreId)) {
      res.status(400).send({ error: "Invalid genre ID" });
    } else {
      const existingGenre = await prisma.genre.findUnique({
        where: {
          genre_id: genreId,
        },
      });

      if (!existingGenre) {
        res.status(404).send({ error: "Genre not found" });
      } else {
        await prisma.media_genre.deleteMany({
          where: {
            genre_id: genreId,
          },
        });

        await prisma.genre.delete({
          where: {
            genre_id: genreId,
          },
        });

        res.status(204).send();
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};