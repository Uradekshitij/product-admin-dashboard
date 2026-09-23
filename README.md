# Product Admin Dashboard

A small admin dashboard for managing products using Next.js, React, Tailwind CSS, Axios, and the free DummyJSON API.

## Features

- User login and logout
- Protected product pages
- Product listing with:
  - Image
  - Title
  - Category
  - Price
  - Rating
  - Stock
- Responsive product table on desktop and cards on mobile
- Pagination with page numbers, Previous/Next buttons, and page sizes of 10, 20, and 50
- Search with debounce
- Category filtering
- Sorting by price, rating, and title
- URL-based page, search, filter, sort, and page-size state
- Product details page
- Add product
- Edit product
- Delete product with confirmation
- Form validation
- Loading, empty, and error states
- Retry option when an API request fails
- Protection against outdated search results replacing newer results

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Axios
- JavaScript
- DummyJSON API

## Setup

Install the dependencies:

```bash
npm install
```

Create the environment file if required:

```bash
cp .env.local.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Login

Use the credentials provided in the assignment:

```text
Username: emilys
Password: emilyspass
```

## API

This project uses the free DummyJSON API:

```text
https://dummyjson.com
```

All API requests are made using Axios.

## Important Implementation Choices

### Search and Category Filter

DummyJSON does not support searching and category filtering in the same API request.

Therefore, when a search term is active, the category filter is disabled. When the search is cleared, the category filter becomes available again.

### Add, Edit and Delete

DummyJSON does not permanently save Add, Edit, and Delete operations.

The application updates the UI locally after successful API responses so that the changes are visible during the current session.

These changes are not persistent after refreshing the page.

### Search Request Handling

Search uses debounce to avoid sending an API request for every keystroke.

Previous search requests are cancelled when a new search request starts, preventing an older response from replacing a newer search result.

## Problem Faced and Solution

One important problem was handling fast product searches.

A slower previous search request could finish after a newer request and display outdated results.

This was solved by using debouncing together with request cancellation, ensuring that only the latest search request can update the product list.
