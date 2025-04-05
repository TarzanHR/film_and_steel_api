import { Request, Response } from 'express'
import prisma from '../client'

export const getCrews = async (req: Request, res: Response) => {
    try {
        const crews = await prisma.crew.findMany();
        res.status(200).send(crews);
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

export const getCrewById = async (req: Request, res: Response) => {
    try {
        const crew_id = parseInt(req.params.crew_id);

        if (isNaN(crew_id)) {
            res.status(400).send({error: "ID must be a number"});
        } else {
            const crew = await prisma.crew.findUnique({
                where: {
                    crew_id: crew_id
                }
            });

            if (!crew) {
                res.status(404).send({error: "ID not found"});
            } else {
                res.status(200).send(crew);
            }
        }
    } catch(error) {
        res.status(500).send({ error:error });
    }
};

export const createCrew = async (req: Request, res: Response) => {
    try {
        const { media_id, directors, writers, crew_id } = req.body;
  
        if (!media_id) {
            res.status(400).send({ error: "Media ID is required" });
        } else {
            let id = crew_id;
            if (!id) {
                const maxCrew = await prisma.crew.findFirst({
                    orderBy: {
                        crew_id: "desc",
                    },
                });
                id = maxCrew ? maxCrew.crew_id + 1 : 1;
            }

            const crew = await prisma.crew.create({
                data: {
                    media_id,
                    directors,
                    writers,
                    crew_id: id
                },
            });
  
            res.status(201).send(crew);
        }
    } catch (error) {
        res.status(500).send({ error: error });
    }
};