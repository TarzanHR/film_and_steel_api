import { Request, Response } from "express";
import prisma from "../client";

export const getRating = async (req: Request, res: Response) => {
  try {
    const rating = await prisma.rating.findMany();
    res.status(200).send(rating);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getRatingById = async (req: Request, res: Response) => {
  try {
    const ratingId = parseInt(req.params.rating_id);

    if (isNaN(ratingId)) {
      res.status(400).send({ error: "Invalid rating ID" });
    } else {
      const rating = await prisma.rating.findUnique({
        where: {
          rating_id: ratingId,
        },
        include: {
          media: true,
        },
      });

      if (!rating) {
        res.status(404).send({ error: "Rating not found" });
      } else {
        res.status(200).send(rating);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const createRating = async (req: Request, res: Response) => {
  try {
    const { media_id, averageRating, numVotes } = req.body;

    if (!media_id) {
      res.status(400).send({ error: "Media ID is required" });
    } else {
      const mediaExists = await prisma.media.findUnique({
        where: {
          media_id: media_id,
        },
      });

      if (!mediaExists) {
        res.status(404).send({ error: "Media not found" });
      } else {
        const maxRating = await prisma.rating.findFirst({
          orderBy: {
            rating_id: "desc",
          },
        });
        const nextId = maxRating ? maxRating.rating_id + 1 : 1;

        const rating = await prisma.rating.create({
          data: {
            rating_id: nextId,
            media_id,
            averageRating,
            numVotes,
          },
        });

        res.status(201).send(rating);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updateRating = async (req: Request, res: Response) => {
  try {
    const ratingId = parseInt(req.params.rating_id);
    const { media_id, averageRating, numVotes } = req.body;

    if (isNaN(ratingId)) {
      res.status(400).send({ error: "Invalid rating ID" });
    } else {
      const existingRating = await prisma.rating.findUnique({
        where: {
          rating_id: ratingId,
        },
      });

      if (!existingRating) {
        res.status(404).send({ error: "Rating not found" });
      } else {
        if (media_id) {
          const mediaExists = await prisma.media.findUnique({
            where: {
              media_id: media_id,
            },
          });

          if (!mediaExists) {
            res.status(404).send({ error: "Media not found" });
            return;
          }
        }

        const rating = await prisma.rating.update({
          where: {
            rating_id: ratingId,
          },
          data: {
            media_id,
            averageRating,
            numVotes,
          },
        });

        res.status(200).send(rating);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const ratingId = parseInt(req.params.rating_id);

    if (isNaN(ratingId)) {
      res.status(400).send({ error: "Invalid rating ID" });
    } else {
      const existingRating = await prisma.rating.findUnique({
        where: {
          rating_id: ratingId,
        },
      });

      if (!existingRating) {
        res.status(404).send({ error: "Rating not found" });
      } else {
        await prisma.rating.delete({
          where: {
            rating_id: ratingId,
          },
        });

        res.status(204).send([]);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
