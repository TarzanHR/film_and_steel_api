import { Request, Response } from "express";
import prisma from "../client";

export const getMedia = async (req: Request, res: Response) => {
  try {
    const media = await prisma.media.findMany({
      include: {
        media_genre: {
          include: { genre: true }
        },
        rating: true
      }
    });
    res.status(200).json(media);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMediaById = async (req: Request, res: Response) => {
  try {
    const mediaId = req.params.media_id;
    if (!mediaId) res.status(400).json({ error: "Media ID is required" });

    const media = await prisma.media.findUnique({
      where: { media_id: mediaId },
      include: {
        media_genre: { include: { genre: true } },
        rating: true
      }
    });

    if (!media) res.status(404).json({ error: "Media not found" });

    res.status(200).json(media);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMediaByName = async (req: Request, res: Response) => {
  try {
    const mediaName = req.params.primaryTitle;

    if (!mediaName) res.status(400).json({ error: "Primary title is required" });

    const media = await prisma.media.findFirst({
      where: {
        primaryTitle: {
          equals: mediaName,
          mode: 'insensitive'
        }
      },
      include: {
        media_genre: { include: { genre: true } },
        rating: true
      }
    });

    if (!media) res.status(404).json({ error: "Media not found" });

    res.status(200).json(media);
  } catch (error: any) {
    res.status(500).json({ error: error.message }); 
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const {
      primaryTitle,
      isAdult,
      startYear,
      runtimeMinutes,
      image_url,
      plot,
      genres  // Tableau d'IDs de genres
    } = req.body;

    if (!primaryTitle) {
      res.status(400).send({ error: "Primary title is required" });
    } else if (!genres || !Array.isArray(genres) || genres.length === 0) {
      res.status(400).send({ error: "At least one genre ID is required" });
    } else {
      const genresArrayString = `{${genres.join(',')}}`;
      
      const result = await prisma.$executeRaw`
        SELECT ajout_media(
          ${primaryTitle}::TEXT, 
          ${isAdult || 0}::INTEGER, 
          ${startYear ? parseInt(startYear) : null}::INTEGER, 
          ${runtimeMinutes?.toString() || null}::TEXT, 
          ${image_url || null}::TEXT, 
          ${plot || null}::TEXT, 
          ${genresArrayString}::INTEGER[]
        );
      `;

      const latestMedia = await prisma.media.findFirst({
        orderBy: {
          media_id: 'desc'
        },
        include: {
          media_genre: {
            include: {
              genre: true
            }
          }
        }
      });
      
      res.status(201).send(latestMedia);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  try {
    const mediaId = req.params.media_id;
    if (!mediaId) res.status(400).json({ error: "Media ID is required" });

    const {
      primaryTitle,
      isAdult,
      startYear,
      runtimeMinutes,
      plot,
      genres // tableau d'IDs de genres (ex: [1, 2, 3])
    } = req.body;

    const existingMedia = await prisma.media.findUnique({
      where: { media_id: mediaId },
      include: { media_genre: true }
    });

    if (!existingMedia) res.status(404).json({ error: "Media not found" });

    // 1. Mettre à jour les champs de base
    const updatedMedia = await prisma.media.update({
      where: { media_id: mediaId },
      data: {
        primaryTitle,
        isAdult: isAdult ?? undefined,
        startYear: startYear ? parseInt(startYear) : undefined,
        runtimeMinutes: runtimeMinutes?.toString(),
        plot
      }
    });

    // 2. Si des genres sont fournis, on les remplace
    if (genres && Array.isArray(genres)) {
      // Supprimer les anciens genres
      await prisma.media_genre.deleteMany({
        where: { media_id: mediaId }
      });

      // Ajouter les nouveaux genres
      const mediaGenreData = genres.map((genreId: number) => ({
        media_id: mediaId,
        genre_id: genreId
      }));

      await prisma.media_genre.createMany({
        data: mediaGenreData
      });
    }

    // 3. Retourner les données mises à jour avec relations
    const mediaWithGenres = await prisma.media.findUnique({
      where: { media_id: mediaId },
      include: {
        media_genre: { include: { genre: true } },
        rating: true
      }
    });

    res.status(200).json(mediaWithGenres);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const mediaId = req.params.media_id;
    if (!mediaId) res.status(400).json({ error: "Media ID is required" });

    const existingMedia = await prisma.media.findUnique({ where: { media_id: mediaId } });
    if (!existingMedia) res.status(404).json({ error: "Media not found" });

    await prisma.rating.deleteMany({ where: { media_id: mediaId } });
    await prisma.media_genre.deleteMany({ where: { media_id: mediaId } });
    await prisma.principal.deleteMany({ where: { media_id: mediaId } });

    await prisma.media.delete({ where: { media_id: mediaId } });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
