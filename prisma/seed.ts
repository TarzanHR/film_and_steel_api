import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Création des catégories
    const categoriesData = [
      { cat_id: 1, cat_name: "Film" },
      { cat_id: 2, cat_name: "Série TV" },
      { cat_id: 3, cat_name: "Documentaire" },
    ];

    for (const cat of categoriesData) {
      await prisma.categories.upsert({
        where: { cat_id: cat.cat_id },
        update: {},
        create: cat,
      });
    }
    console.log("Catégories créées");

    // Création des genres
    const genresData = [
      { genre_id: 1, genre_name: "Action" },
      { genre_id: 2, genre_name: "Comédie" },
      { genre_id: 3, genre_name: "Drame" },
      { genre_id: 4, genre_name: "Science-Fiction" },
    ];

    for (const genre of genresData) {
      await prisma.genre.upsert({
        where: { genre_id: genre.genre_id },
        update: {},
        create: genre,
      });
    }
    console.log("Genres créés");

    // Création des médias
    const mediasData = [
      {
        media_id: "tt0816692",
        primaryTitle: "Interstellar",
        isAdult: 0,
        startYear: 2014,
        runtimeMinutes: "169",
      },
      {
        media_id: "tt0111161",
        primaryTitle: "Les Évadés",
        isAdult: 0,
        startYear: 1994,
        runtimeMinutes: "142",
      },
      {
        media_id: "tt0903747",
        primaryTitle: "Breaking Bad",
        isAdult: 0,
        startYear: 2008,
        endYear: "2013",
        runtimeMinutes: "49",
      },
    ];

    for (const media of mediasData) {
      await prisma.media.upsert({
        where: { media_id: media.media_id },
        update: {},
        create: media,
      });
    }
    console.log("Médias créés");

    // Création des personnes
    const personnesData = [
      {
        perso_id: "nm0000138",
        primaryName: "Christopher Nolan",
        birthYear: "1970",
        primaryProfession: "Director, Writer, Producer",
      },
      {
        perso_id: "nm0000151",
        primaryName: "Morgan Freeman",
        birthYear: "1937",
        primaryProfession: "Actor, Producer",
      },
      {
        perso_id: "nm0186505",
        primaryName: "Vince Gilligan",
        birthYear: "1967",
        primaryProfession: "Producer, Writer, Director",
      },
      {
        perso_id: "nm0000190",
        primaryName: "Matthew McConaughey",
        birthYear: "1969",
        primaryProfession: "Actor, Producer",
      },
    ];

    for (const personne of personnesData) {
      await prisma.personne.upsert({
        where: { perso_id: personne.perso_id },
        update: {},
        create: personne,
      });
    }
    console.log("Personnes créées");

    // Créer les directeurs
    await prisma.directeur.upsert({
      where: { directeur_id: "nm0000138" },
      update: {},
      create: {
        directeur_id: "nm0000138", // Christopher Nolan
      },
    });

    await prisma.directeur.upsert({
      where: { directeur_id: "nm0186505" },
      update: {},
      create: {
        directeur_id: "nm0186505", // Vince Gilligan
      },
    });
    console.log("Directeurs créés");

    // Créer les scénaristes
    await prisma.scenariste.upsert({
      where: { scenariste_id: "nm0000138" },
      update: {},
      create: {
        scenariste_id: "nm0000138", // Christopher Nolan
      },
    });

    await prisma.scenariste.upsert({
      where: { scenariste_id: "nm0186505" },
      update: {},
      create: {
        scenariste_id: "nm0186505", // Vince Gilligan
      },
    });
    console.log("Scénaristes créés");

    // Créer les crews
    const crewsData = [
      {
        crew_id: 1,
        media_id: "tt0816692",
        directors: "nm0000138", // Christopher Nolan
        writers: "nm0000138",
      },
      {
        crew_id: 2,
        media_id: "tt0903747",
        directors: "nm0186505", // Vince Gilligan
        writers: "nm0186505",
      },
    ];

    for (const crew of crewsData) {
      await prisma.crew.upsert({
        where: { crew_id: crew.crew_id },
        update: {},
        create: crew,
      });
    }
    console.log("Crews créés");

    // Créer les relations média-genre
    const mediaGenresData = [
      { media_id: "tt0816692", genre_id: 4 }, // Interstellar - SciFi
      { media_id: "tt0816692", genre_id: 3 }, // Interstellar - Drame
      { media_id: "tt0111161", genre_id: 3 }, // Les Évadés - Drame
      { media_id: "tt0903747", genre_id: 3 }, // Breaking Bad - Drame
    ];

    for (const mg of mediaGenresData) {
      await prisma.media_genre.upsert({
        where: {
          media_id_genre_id: {
            media_id: mg.media_id,
            genre_id: mg.genre_id,
          },
        },
        update: {},
        create: mg,
      });
    }
    console.log("Relations média-genre créées");

    // Créer les ratings
    const ratingsData = [
      {
        rating_id: 1,
        media_id: "tt0816692",
        averageRating: 8.6,
        numVotes: 1560000,
      },
      {
        rating_id: 2,
        media_id: "tt0111161",
        averageRating: 9.3,
        numVotes: 2400000,
      },
      {
        rating_id: 3,
        media_id: "tt0903747",
        averageRating: 9.5,
        numVotes: 1700000,
      },
    ];

    for (const rating of ratingsData) {
      await prisma.rating.upsert({
        where: { rating_id: rating.rating_id },
        update: {},
        create: rating,
      });
    }
    console.log("Ratings créés");

    // Créer les relations principal (acteur, réalisateur)
    const principalsData = [
      {
        media_id: "tt0816692",
        ordering: 1,
        perso_id: "nm0000190", // McConaughey
        cat_id: 1, // Film
        job: "Actor",
        characters: "Cooper",
      },
      {
        media_id: "tt0816692",
        ordering: 2,
        perso_id: "nm0000138", // Nolan
        cat_id: 1, // Film
        job: "Director",
      },
      {
        media_id: "tt0111161",
        ordering: 1,
        perso_id: "nm0000151", // Freeman
        cat_id: 1, // Film
        job: "Actor",
        characters: 'Ellis Boyd "Red" Redding',
      },
      {
        media_id: "tt0903747",
        ordering: 1,
        perso_id: "nm0186505", // Gilligan
        cat_id: 2, // Série TV
        job: "Creator, Producer",
      },
    ];

    for (const principal of principalsData) {
      await prisma.principal.upsert({
        where: {
          media_id_ordering_perso_id_cat_id: {
            media_id: principal.media_id,
            ordering: principal.ordering,
            perso_id: principal.perso_id,
            cat_id: principal.cat_id,
          },
        },
        update: {},
        create: principal,
      });
    }
    console.log("Relations principal créées");

    // Création d'un utilisateur admin
    await prisma.mp_users.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password:
          "$2b$10$mG9LIcqHsZDezPjwgvHyuOUjn/vsH0.nWcFkQO89tJsYYbx7OkTLG", // hashé de 'admin123'
        firstname: "Admin",
        lastname: "User",
        admin: 1,
      },
    });
    console.log("Utilisateur admin créé");

    console.log("Seed terminé avec succès");
  } catch (error) {
    console.error("Erreur lors du seed:", error);
  }
}

main()
  .catch((e) => {
    console.error("Erreur non gérée:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
