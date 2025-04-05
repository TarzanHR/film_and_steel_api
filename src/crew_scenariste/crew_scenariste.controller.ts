import { Request, Response } from 'express'
import prisma from '../client'

export const getCrewScenaristes = async (req: Request, res: Response) => {
    try {
        const crewScenaristes = await prisma.crew_scenaristes.findMany({
            include: {
                crew: true,
                scenariste: {
                    include: {
                        personne: true
                    }
                }
            }
        });
        res.status(200).send(crewScenaristes);
    } catch (error) {
        res.status(500).send({ error: error });
    }
};

export const getCrewsByScenariste = async (req: Request, res: Response) => {
    try {
        const scenariste_id = req.params.scenariste_id;

        const crewScenaristes = await prisma.crew_scenaristes.findMany({
            where: {
                scenariste_id: scenariste_id
            },
            include: {
                crew: true,
                scenariste: {
                    include: {
                        personne: true
                    }
                }
            }
        });

        if (crewScenaristes.length === 0) res.status(404).send({ error: "No crew associations found for this scenariste" });

        const crewIds = crewScenaristes.map(cs => cs.crew_id);

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
            scenariste: crewScenaristes[0]?.scenariste,
            crews: crews
        });
    } catch (error) {
        console.error("Error in getCrewsByScenariste:", error);
        res.status(500).send({ error: error });
    }
};

export const getScenaristesByCrew = async (req: Request, res: Response) => {
    try {
        const crew_id = parseInt(req.params.crew_id);

        if (isNaN(crew_id)) res.status(400).send({ error: "Crew ID must be a number" });

        const crew = await prisma.crew.findUnique({
            where: {
                crew_id: crew_id
            }
        });

        if (!crew) res.status(404).send({ error: "Crew not found" });

        const crewScenaristes = await prisma.crew_scenaristes.findMany({
            where: {
                crew_id: crew_id
            },
            include: {
                scenariste: {
                    include: {
                        personne: true
                    }
                }
            }
        });

        if (crewScenaristes.length === 0) res.status(404).send({ error: "No scenaristes found for this crew" });

        const scenaristes = crewScenaristes.map(cs => cs.scenariste);

        res.status(200).send({
            crew: crew,
            scenaristes: scenaristes
        });
    } catch (error) {
        console.error("Error in getScenaristesByCrew:", error);
        res.status(500).send({ error: error });
    }
};

/**
 * Crée une nouvelle association entre un crew et un scénariste
 */
export const createCrewScenariste = async (req: Request, res: Response) => {
    try {
        const { crew_id, scenariste_id } = req.body;

        if (!crew_id || !scenariste_id) {
            return res.status(400).send({ error: "Crew ID and Scenariste ID are required" });
        }

        // Vérifier que le crew existe
        const crew = await prisma.crew.findUnique({
            where: {
                crew_id: parseInt(crew_id)
            }
        });

        if (!crew) {
            return res.status(404).send({ error: "Crew not found" });
        }

        // Vérifier que le scénariste existe
        const scenariste = await prisma.scenariste.findUnique({
            where: {
                scenariste_id: scenariste_id
            }
        });

        if (!scenariste) {
            return res.status(404).send({ error: "Scenariste not found" });
        }

        // Vérifier si l'association existe déjà
        const existingAssociation = await prisma.crew_scenaristes.findFirst({
            where: {
                crew_id: parseInt(crew_id),
                scenariste_id: scenariste_id
            }
        });

        if (existingAssociation) {
            return res.status(409).send({ error: "This association already exists" });
        }

        // Créer l'association
        const crewScenariste = await prisma.crew_scenaristes.create({
            data: {
                crew_id: parseInt(crew_id),
                scenariste_id: scenariste_id
            }
        });

        // Mettre à jour le champ writers dans la table crew si nécessaire
        const currentWriters = crew.writers || "";
        if (!currentWriters.includes(scenariste_id)) {
            let newWriters = currentWriters;
            if (currentWriters) {
                newWriters += "," + scenariste_id;
            } else {
                newWriters = scenariste_id;
            }

            await prisma.crew.update({
                where: {
                    crew_id: parseInt(crew_id)
                },
                data: {
                    writers: newWriters
                }
            });
        }

        // Récupérer l'association créée avec ses relations
        const fullCrewScenariste = await prisma.crew_scenaristes.findFirst({
            where: {
                crew_id: parseInt(crew_id),
                scenariste_id: scenariste_id
            },
            include: {
                crew: true,
                scenariste: {
                    include: {
                        personne: true
                    }
                }
            }
        });

        res.status(201).send(fullCrewScenariste);
    } catch (error) {
        console.error("Error in createCrewScenariste:", error);
        res.status(500).send({ error: error });
    }
};

/**
 * Supprime une association entre un crew et un scénariste
 */
export const deleteCrewScenariste = async (req: Request, res: Response) => {
    try {
        const crew_id = parseInt(req.params.crew_id);
        const scenariste_id = req.params.scenariste_id;

        if (isNaN(crew_id)) {
            return res.status(400).send({ error: "Crew ID must be a number" });
        }

        if (!scenariste_id) {
            return res.status(400).send({ error: "Scenariste ID is required" });
        }

        // Vérifier que l'association existe
        const association = await prisma.crew_scenaristes.findFirst({
            where: {
                crew_id: crew_id,
                scenariste_id: scenariste_id
            }
        });

        if (!association) {
            return res.status(404).send({ error: "Association not found" });
        }

        // Supprimer l'association
        await prisma.crew_scenaristes.delete({
            where: {
                crew_id_scenariste_id: {
                    crew_id: crew_id,
                    scenariste_id: scenariste_id
                }
            }
        });

        // Mettre à jour le champ writers dans la table crew
        const crew = await prisma.crew.findUnique({
            where: {
                crew_id: crew_id
            }
        });

        if (crew && crew.writers) {
            // Retirer l'ID du scénariste de la chaîne writers
            const writersArray = crew.writers.split(',');
            const filteredWriters = writersArray.filter(id => id !== scenariste_id);
            const newWriters = filteredWriters.join(',');

            await prisma.crew.update({
                where: {
                    crew_id: crew_id
                },
                data: {
                    writers: newWriters || null
                }
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error in deleteCrewScenariste:", error);
        res.status(500).send({ error: error });
    }
};