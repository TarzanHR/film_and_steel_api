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
    const { perso_id, primaryName, birthYear, deathYear, primaryProfession } =
      req.body;

    if (!perso_id || !primaryName) {
      res.status(400).send({ error: "Person ID and name are required" });
    } else {
      // Vérifier si cette personne existe déjà
      const existingPersonne = await prisma.personne.findUnique({
        where: {
          perso_id: perso_id,
        },
      });

      if (existingPersonne) {
        res.status(409).send({ error: "Person with this ID already exists" });
      } else {
        const personne = await prisma.personne.create({
          data: {
            perso_id,
            primaryName,
            birthYear,
            deathYear,
            primaryProfession,
          },
        });

        res.status(201).send(personne);
      }
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const updatePersonne = async (req: Request, res: Response) => {
  try {
    const personneId = req.params.perso_id;
    const { primaryName, birthYear, deathYear, primaryProfession } = req.body;

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
