# MongoDB Fundamentals - Week 1

## Setup Instructions

Before you begin this assignment, please make sure you have the following installed:

1. **MongoDB Community Edition** - [Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
2. **MongoDB Shell (mongosh)** - This is included with MongoDB Community Edition
3. **Node.js** - [Download here](https://nodejs.org/)

### Node.js Package Setup

Once you have Node.js installed, run the following commands in your assignment directory:

```bash
# Initialize a package.json file
npm init -y

# Install the MongoDB Node.js driver
npm install mongodb
```

## Assignment Overview

This week focuses on MongoDB fundamentals including:
- Creating and connecting to MongoDB databases
- CRUD operations (Create, Read, Update, Delete)
- MongoDB queries and filters
- Aggregation pipelines
- Indexing for performance

## Submission

Complete all the exercises in this assignment and push your code to GitHub using the provided GitHub Classroom link.

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install MongoDB locally or set up a MongoDB Atlas account
4. Run the provided `insert_books.js` script to populate your database
5. Complete the tasks in the assignment document

## Files Included

- `Week1-Assignment.md`: Detailed assignment instructions
- `insert_books.js`: Script to populate your MongoDB database with sample book data

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- MongoDB Shell (mongosh) or MongoDB Compass

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/) 

Here is a `README.md` file explaining:

# MongoDB Query Examples for a `books` Collection

This document contains a set of MongoDB Shell queries organized into tasks, demonstrating various common and advanced operations on a hypothetical `books` collection.

-----

## Prerequisites

To run these commands, you need:

1.  A running MongoDB instance.
2.  Access to the MongoDB Shell (`mongosh`).
3.  A database with a collection named `books` that has documents containing fields like `title`, `author`, `genre`, `price`, `published_year`, `stock`, and `in_stock`.

-----

## Task 2: Basic CRUD Operations

These queries demonstrate fundamental **C**reate, **R**ead, **U**pdate, and **D**elete (**CRUD**) operations.

### Find Operations (Read)

| Description | Query |
| :--- | :--- |
| **Find all books in a specific genre** | `db.books.find({ genre: "Gothic Fiction" }).pretty();` |
| **Find books published after a certain year** | `db.books.find({ published_year: { $gt: 1925 } }).pretty();` |
| **Find books by a specific author** | `db.books.find({ author: "Paulo Coelho" }).pretty();` |

### Update Operation

| Description | Query |
| :--- | :--- |
| **Update the price of a specific book** (e.g., set price to **$19.99** for "The Alchemist") | `javascript\ndb.books.updateOne(\n  { title: "The Alchemist" },\n  { $set: { price: 19.99 } }\n);\n` |

### Delete Operation

| Description | Query |
| :--- | :--- |
| **Delete a book by its title** (e.g., "Moby Dick") | `db.books.deleteOne({ title: "Moby Dick" });` |

-----

## Task 3: Advanced Queries

These queries combine filtering, projection, sorting, and pagination for more complex data retrieval.

### Combined Filtering and Projection

| Description | Query |
| :--- | :--- |
| **Find books that are both in stock and published after 2010**, only returning `title`, `author`, and `price`. | `javascript\ndb.books.find(\n  { stock: { $gt: 0 }, published_year: { $gt: 2010 } },\n  { title: 1, author: 1, price: 1, _id: 0 }\n);\n` |

### Sorting and Pagination

These examples use a filter to find books **in stock** and published **after 2010**, then apply sorting and pagination (5 books per page, starting at page 1, which is **skip(0)**).

| Description | Query |
| :--- | :--- |
| **Sort by price (Ascending)**, apply skip/limit for pagination | `javascript\ndb.books.find(\n  { in_stock: true, published_year: { $gt: 2010 } },\n  { title: 1, author: 1, price: 1, _id: 0 }\n).sort({ price: 1 }).skip(0).limit(5).pretty();\n` |
| **Sort by price (Descending)**, apply skip/limit for pagination | `javascript\ndb.books.find(\n  { in_stock: true, published_year: { $gt: 2010 } },\n  { title: 1, author: 1, price: 1, _id: 0 }\n).sort({ price: -1 }).skip(0).limit(5).pretty();\n` |

-----

## Task 4: Aggregation Pipeline

These queries use the **Aggregation Framework** to perform complex data transformations and calculations.

### Average Price by Genre

| Description | Stages |
| :--- | :--- |
| **Calculate the average price of books by genre** | 1. **`$match`**: Filters out documents missing `genre` or `price`. |
| | 2. **`$group`**: Groups by `genre` and calculates the `averagePrice`. |
| | 3. **`$sort`**: Sorts results by `averagePrice` in descending order. |

```javascript
db.books.aggregate([
  { $match: { genre: { $exists: true }, price: { $exists: true } } },
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } },
  { $sort: { averagePrice: -1 } }
]).pretty();
```

### Author with Most Books

| Description | Stages |
| :--- | :--- |
| **Find the author with the most books** | 1. **`$match`**: Filters out documents missing the `author` field. |
| | 2. **`$group`**: Groups by `author` and calculates the `bookCount`. |
| | 3. **`$sort`**: Sorts by `bookCount` in descending order. |
| | 4. **`$limit`**: Restricts the output to the top one result. |

```javascript
db.books.aggregate([
  { $match: { author: { $exists: true } } },
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]).pretty();
```

### Books Grouped by Publication Decade

| Description | Stages |
| :--- | :--- |
| **Group books by publication decade and count them** | 1. **`$match`**: Filters out documents missing `published_year`. |
| | 2. **`$group`**: Groups by a calculated decade (e.g., 1993 becomes 1990) and counts the books. |
| | 3. **`$sort`**: Sorts by decade in ascending order. |
| | 4. **`$project`**: Renames the `_id` field to `decade` and includes `bookCount`. |

```javascript
db.books.aggregate([
  { $match: { published_year: { $exists: true } } },
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } * 10 },
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } },
  { $project: { decade: "$_id", bookCount: 1, _id: 0 } }
]).pretty();
```

-----

## Task 5: Indexing

These commands create indexes to improve query performance, particularly for fields frequently used in search criteria (`find`), sort operations (`sort`), and aggregation stages (`$match`, `$sort`).

| Description | Query |
| :--- | :--- |
| **Create a single-field index on the `title` field** | `db.books.createIndex({ title: 1 });` |
| **Create a compound index on `author` and `published_year`** | `db.books.createIndex({ author: 1, published_year: 1 });` |