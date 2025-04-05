import { Request, Response } from "express";
import prisma from "../client";

export const getPersonnes = async (req: Request, res: Response) => {
  try {
    const personnes = await prisma.personne.findMany();
    res.status(200).send(personnes);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getPersonneById = async (req: Request, res: Response) => {
  try {
    const personneId = req.params.perso_id;

    if (!personneId) {
      res.status(400).send({ error: "Person ID is required" });
    } else {
      const personne = await prisma.personne.findUnique({
        where: {
          perso_id: personneId,
        },
      });

      if (!personne) {
        res.status(404).send({ error: "Person not found" });
      } else {
        res.status(200).send(personne);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getPersonneByName = async (req: Request, res: Response) => {
  try {
    const personneName = String(req.params.perso_name);

    const personne = await prisma.personne.findFirst({
      where: {
        primaryName: {
          equals: personneName,
          mode: 'insensitive' 
        }
      }
    });

    if (!personne) {
      res.status(404).send({ error: "Personne not found" });
    } else {
      res.status(200).send(personne);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export const createPersonne = async (req: Request, res: Response) => {
  try {
    const { primaryName, birthYear, deathYear, primaryProfession, roles } = req.body;

    // Convertir \\N en null
    const personneData = {
      primaryName,
      birthYear: birthYear === "\\N" ? null : birthYear,
      deathYear: deathYear === "\\N" ? null : deathYear,
      primaryProfession,
    };

    // Créer d'abord une entrée dans la table personne
    const personne = await prisma.personne.create({
      data: personneData,
    });

    if (roles && Array.isArray(roles)) {
      if (roles.includes('directeur')) {
        await prisma.directeur.create({
          data: {
            directeur_id: personne.perso_id,
          },
        });
      }
      if (roles.includes('scenariste')) {
        await prisma.scenariste.create({
          data: {
            scenariste_id: personne.perso_id,
          },
        });
      }
    } else {
      res.status(400).send({ error: "No valid roles specified" });
    }

    res.status(201).send(personne);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updatePersonne = async (req: Request, res: Response) => {
  try {
    const personneId = req.params.perso_id;
    const { primaryName, birthYear, deathYear, primaryProfession, roles } = req.body;

    if (!personneId) {
      res.status(400).send({ error: "Person ID is required" });
    } else {
      const existingPersonne = await prisma.personne.findUnique({
        where: {
          perso_id: personneId,
        },
        include: {
          directeur: true,
          scenariste: true,
        },
      });

      if (!existingPersonne) {
        res.status(404).send({ error: "Person not found" });
      } else {
        // Mettre à jour les informations de base de la personne
        const personne = await prisma.personne.update({
          where: {
            perso_id: personneId,
          },
          data: {
            primaryName,
            birthYear,
            deathYear,
            primaryProfession,
          },
        });

        // Gérer les rôles
        if (roles && Array.isArray(roles)) {
          if (existingPersonne.directeur && !roles.includes('directeur')) {
            await prisma.directeur.delete({
              where: {
                directeur_id: personneId,
              },
            });
          }

          if (existingPersonne.scenariste && !roles.includes('scenariste')) {
            await prisma.scenariste.delete({
              where: {
                scenariste_id: personneId,
              },
            });
          }

          if (roles.includes('directeur') && !existingPersonne.directeur) {
            await prisma.directeur.create({
              data: {
                directeur_id: personneId,
              },
            });
          }

          if (roles.includes('scenariste') && !existingPersonne.scenariste) {
            await prisma.scenariste.create({
              data: {
                scenariste_id: personneId,
              },
            });
          }
        }

        res.status(200).send(personne);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};


export const deletePersonne = async (req: Request, res: Response) => {
  try {
    const personneId = req.params.perso_id;

    if (!personneId) {
      res.status(400).send({ error: "Person ID is required" });
    } else {
      const existingPersonne = await prisma.personne.findUnique({
        where: {
          perso_id: personneId,
        },
      });

      if (!existingPersonne) {
        res.status(404).send({ error: "Person not found" });
      } else {
        await prisma.personne.delete({
          where: {
            perso_id: personneId,
          },
        });

        res.status(204).send([]);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
