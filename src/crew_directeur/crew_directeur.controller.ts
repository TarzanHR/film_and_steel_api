import { Request, Response } from 'express'
import prisma from '../client'

export const getCrewDirecteurs = async (req: Request, res: Response) => {
    try {
        const crewDirecteurs = await prisma.crew_directeurs.findMany({
            include: {
                crew: true,
                directeur: {
                    include: {
                        personne: true
                    }
                }
            }
        });
        res.status(200).send(crewDirecteurs);
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

export const getCrewsByDirecteur = async (req: Request, res: Response) => {
    try {
        const directeur_id = req.params.directeur_id;

        const crewDirecteurs = await prisma.crew_directeurs.findMany({
            where: {
                directeur_id: directeur_id
            },
            include: {
                crew: true,
                directeur: {
                    include: {
                        personne: true
                    }
                }
            }
        });

        if (crewDirecteurs.length === 0) res.status(404).send({ error: "No crew associations found for this directeurs" });

        const crewIds = crewDirecteurs.map(cd => cd.crew_id);

        const crews = await prisma.crew.findMany({
            where: {
                crew_id: {
                    in: crewIds
                }
            },
            include: {
                crew_scenaristes: {
                    include: {
                        scenariste: {
                            include: {
                                personne: true
                            }
                        }
                    }
                },
                crew_directeurs: {
                    include: {
                        directeur: {
                            include: {
                                personne: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).send({
            directeur: crewDirecteurs[0]?.directeur,
            crews: crews
        });
    } catch (error) {
        console.error("Error in getCrewsByDirecteur:", error);
        res.status(500).send({ error: error });
    }
};

export const getDirecteursByCrew = async (req: Request, res: Response) => {
    try {
        const crew_id = parseInt(req.params.crew_id);

        if (isNaN(crew_id)) res.status(400).send({ error: "Crew ID must be a number" });

        const crew = await prisma.crew.findUnique({
            where: {
                crew_id: crew_id
            }
        });

        if (!crew) res.status(404).send({ error: "Crew not found" });

        const crewDirecteurs = await prisma.crew_directeurs.findMany({
            where: {
                crew_id: crew_id
            },
            include: {
                directeur: {
                    include: {
                        personne: true
                    }
                }
            }
        });

        if (crewDirecteurs.length === 0) res.status(404).send({ error: "No directeurs found for this crew" });

        const directeurs = crewDirecteurs.map(cd => cd.directeur);

        res.status(200).send({
            crew: crew,
            directeurs: directeurs
        });
    } catch (error) {
        console.error("Error in getDirecteursByCrew:", error);
        res.status(500).send({ error: error });
    }
};
