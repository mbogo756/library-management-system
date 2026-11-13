# Library Management System

## Schema Decisions

Each book references a genre using `genreId`, which is a foreign key to the `Genre` table. This keeps genre information in one place, lets multiple books share the same genre, and helps prevent inconsistent genre names. It also makes it straightforward to find all books in a genre.

## Prisma and document databases

In Prisma, related data is modeled with relations and foreign keys between tables. In a document database, related information is often embedded inside a document. Here, a book stores a reference to its genre rather than a copy of the genre details.