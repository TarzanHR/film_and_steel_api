import { Request, Response } from "express";
import prisma from "../client";

export const getScenaristes = async (req: Request, res: Response) => {
    try {
        const scenaristes = await prisma.scenariste.findMany({
            include: {
                personne: true
            }
        });
        res.status(200).send(scenaristes);
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

export const getScenaristeById = async (req: Request, res: Response) => {
    try {
        const scenaristeId = req.params.scenariste_id;

        const scenariste = await prisma.scenariste.findUnique({
            where: {
                scenariste_id: scenaristeId,
            },
            include: {
                personne: true
            }
        });

        if (!scenariste) {
            res.status(404).json({ error: "Scenariste not found" });
        } else {
            res.status(200).json(scenariste);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getScenaristeByName = async (req: Request, res: Response) => {
    try {
        const scenaristeName = String(req.params.perso_name);

        const scenariste = await prisma.scenariste.findFirst({
            where: {
                personne: {
                    primaryName: {
                        equals: scenaristeName,
                        mode: 'insensitive'
                    }
                }
            },
            include: {
                personne: true
            }
        });

        if (!scenariste) {
            res.status(404).json({ error: "Scenariste not found" });
        } else {
            res.status(200).json(scenariste);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};