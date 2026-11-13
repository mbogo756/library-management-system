import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const genres = [
  { name: 'Fiction', description: 'Literary and contemporary fiction.' },
  { name: 'Fantasy', description: 'Stories featuring imagined worlds and magic.' },
  { name: 'Science Fiction', description: 'Stories exploring science and imagined futures.' },
  { name: 'History', description: 'Books about historical people and events.' },
];

const books = [
  { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780000000001', publishedYear: 1958, genre: 'Fiction' },
  { title: 'The River Between', author: 'Ngũgĩ wa Thiong’o', isbn: '9780000000002', publishedYear: 1965, genre: 'Fiction' },
  { title: 'Purple Hibiscus', author: 'Chimamanda Ngozi Adichie', isbn: '9780000000003', publishedYear: 2003, genre: 'Fiction' },
  { title: 'The Old Man and the Sea', author: 'Ernest Hemingway', isbn: '9780000000004', publishedYear: 1952, genre: 'Fiction' },

  { title: 'The Hobbit', author: 'J. R. R. Tolkien', isbn: '9780000000005', publishedYear: 1937, genre: 'Fantasy' },
  { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', isbn: '9780000000006', publishedYear: 1968, genre: 'Fantasy' },
  { title: 'The Lion, the Witch and the Wardrobe', author: 'C. S. Lewis', isbn: '9780000000007', publishedYear: 1950, genre: 'Fantasy' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '9780000000008', publishedYear: 2007, genre: 'Fantasy' },

  { title: 'Dune', author: 'Frank Herbert', isbn: '9780000000009', publishedYear: 1965, genre: 'Science Fiction' },
  { title: 'Frankenstein', author: 'Mary Shelley', isbn: '9780000000010', publishedYear: 1818, genre: 'Science Fiction' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780000000011', publishedYear: 1969, genre: 'Science Fiction' },
  { title: 'The Martian', author: 'Andy Weir', isbn: '9780000000012', publishedYear: 2011, genre: 'Science Fiction' },

  { title: 'A History of Kenya', author: 'W. R. Ochieng’', isbn: '9780000000013', publishedYear: 1985, genre: 'History' },
  { title: 'The Wretched of the Earth', author: 'Frantz Fanon', isbn: '9780000000014', publishedYear: 1961, genre: 'History' },
  { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780000000015', publishedYear: 1994, genre: 'History' },
  { title: 'The Guns of August', author: 'Barbara W. Tuchman', isbn: '9780000000016', publishedYear: 1962, genre: 'History' },
];

async function main() {
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    });
  }

  for (const book of books) {
    const { genre, ...bookData } = book;

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        ...bookData,
        genre: { connect: { name: genre } },
      },
      create: {
        ...bookData,
        genre: { connect: { name: genre } },
      },
    });
  }

  console.log(`Seeded ${genres.length} genres and ${books.length} books.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });