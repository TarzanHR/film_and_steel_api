import { Request, Response } from "express";
import prisma from "../client";

export const getPrincipals = async (req: Request, res: Response) => {
  try {
    const principals = await prisma.principal.findMany();
    res.status(200).send(principals);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getPrincipalsByMediaId = async (req: Request, res: Response) => {
  try {
    const mediaId = req.params.media_id;

    if (!mediaId) {
      res.status(400).send({ error: "Media ID is required" });
    } else {
      const principals = await prisma.principal.findMany({
        where: {
          media_id: mediaId,
        },
      });

      res.status(200).send(principals);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getPrincipalsByPersonneId = async (
  req: Request,
  res: Response
) => {
  try {
    const personneId = req.params.perso_id;

    if (!personneId) {
      res.status(400).send({ error: "Person ID is required" });
    } else {
      const principals = await prisma.principal.findMany({
        where: {
          perso_id: personneId,
        },
      });

      res.status(200).send(principals);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const createPrincipal = async (req: Request, res: Response) => {
  try {
    const { media_id, perso_id, cat_id, ordering, job, characters } = req.body;

    if (!media_id || !perso_id || !cat_id || ordering === undefined) {
      res.status(400).send({
        error: "media_id, perso_id, cat_id, and ordering are required",
      });
    } else {
      // Vérifier que le média existe
      const mediaExists = await prisma.media.findUnique({
        where: { media_id: media_id },
      });

      if (!mediaExists) {
        res.status(404).send({ error: "Media not found" });
      } else {
        // Vérifier que la personne existe
        const personneExists = await prisma.personne.findUnique({
          where: { perso_id: perso_id },
        });

        if (!personneExists) {
          res.status(404).send({ error: "Person not found" });
        } else {
          // Vérifier que la catégorie existe
          const categorieExists = await prisma.categories.findUnique({
            where: { cat_id: parseInt(cat_id) },
          });

          if (!categorieExists) {
            res.status(404).send({ error: "Category not found" });
          } else {
            // Vérifie si cette combinaison existe déjà
            const existingPrincipal = await prisma.principal.findUnique({
              where: {
                media_id_ordering_perso_id_cat_id: {
                  media_id: media_id,
                  ordering: parseInt(ordering),
                  perso_id: perso_id,
                  cat_id: parseInt(cat_id),
                },
              },
            });

            if (existingPrincipal) {
              res
                .status(409)
                .send({ error: "This principal relationship already exists" });
            } else {
              const principal = await prisma.principal.create({
                data: {
                  media_id,
                  ordering: parseInt(ordering),
                  perso_id,
                  cat_id: parseInt(cat_id),
                  job,
                  characters,
                },
              });

              res.status(201).send(principal);
            }
          }
        }
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updatePrincipal = async (req: Request, res: Response) => {
  try {
    const { media_id, ordering, perso_id, cat_id } = req.params;
    const { job, characters } = req.body;

    if (!media_id || !ordering || !perso_id || !cat_id) {
      res.status(400).send({ error: "All principal identifiers are required" });
    } else {
      const existingPrincipal = await prisma.principal.findUnique({
        where: {
          media_id_ordering_perso_id_cat_id: {
            media_id: media_id,
            ordering: parseInt(ordering),
            perso_id: perso_id,
            cat_id: parseInt(cat_id),
          },
        },
      });

      if (!existingPrincipal) {
        res.status(404).send({ error: "Principal relationship not found" });
      } else {
        const principal = await prisma.principal.update({
          where: {
            media_id_ordering_perso_id_cat_id: {
              media_id: media_id,
              ordering: parseInt(ordering),
              perso_id: perso_id,
              cat_id: parseInt(cat_id),
            },
          },
          data: {
            job,
            characters,
          },
        });

        res.status(200).send(principal);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const deletePrincipal = async (req: Request, res: Response) => {
  try {
    const { media_id, ordering, perso_id, cat_id } = req.params;

    if (!media_id || !ordering || !perso_id || !cat_id) {
      res.status(400).send({ error: "All principal identifiers are required" });
    } else {
      const existingPrincipal = await prisma.principal.findUnique({
        where: {
          media_id_ordering_perso_id_cat_id: {
            media_id: media_id,
            ordering: parseInt(ordering),
            perso_id: perso_id,
            cat_id: parseInt(cat_id),
          },
        },
      });

      if (!existingPrincipal) {
        res.status(404).send({ error: "Principal relationship not found" });
      } else {
        await prisma.principal.delete({
          where: {
            media_id_ordering_perso_id_cat_id: {
              media_id: media_id,
              ordering: parseInt(ordering),
              perso_id: perso_id,
              cat_id: parseInt(cat_id),
            },
          },
        });

        res.status(204).send();
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
