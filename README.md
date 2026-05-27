# BookMatch (React)

BookMatch is now a React + Vite web app for searching books, tracking a reading challenge, and managing a personal collection.

## Features

- Professional single-page layout with tabbed sections
- Google Books powered search with education/fiction category filters
- LocalStorage-backed cart and library
- Reading challenge overview with total words and estimated reading time
- Legacy group-picture assets removed

## Run Locally

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the project root and add:

```bash
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
```

You can copy from `.env.example`.

Google Books API docs: [https://developers.google.com/books](https://developers.google.com/books)
