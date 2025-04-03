import { Request, Response } from "express";
import prisma from "../client";

export const getDirecteurs = async (req: Request, res: Response) => {
    try {
        const directeurs = await prisma.directeur.findMany({
            include: {
                personne: true
            }
        });
        res.status(200).send(directeurs);
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

export const getDirecteurById = async (req: Request, res: Response) => {
    try {
        const directeurId = req.params.directeur_id;

        const directeur = await prisma.directeur.findUnique({
            where: {
                directeur_id: directeurId,
            },
            include: {
                personne: true
            }
        });

        if (!directeur) res.status(404).json({ error: "Directeur not found" });

        res.status(200).json(directeur);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getDirecteurByName = async (req: Request, res: Response) => {
    try {
        const directeurName = String(req.params.perso_name);

        const directeur = await prisma.directeur.findFirst({
            where: {
                personne: {
                    primaryName: {
                        equals: directeurName,
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                personne: true
            }
        });

        if (!directeur) res.status(404).json({ error: "Directeur not found" });

        res.status(200).json(directeur);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
