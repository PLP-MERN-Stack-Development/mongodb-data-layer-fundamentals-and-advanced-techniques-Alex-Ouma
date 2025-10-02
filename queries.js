// ### Task 2: Basic CRUD Operations
// Write MongoDB queries to:
// Find all books in a specific genre
db.books.find({ genre: "Gothic Fiction" }).pretty();
// Find books published after a certain year
db.books.find({ published_year: { $gt: 1925 } }).pretty();
// Find books by a specific author
db.books.find({ author: "Paulo Coelho" }).pretty();
//Update the price of a specific book (e.g., set price to 19.99 for book with title "The Alchemist")
db.books.updateOne(
  { title: "The Alchemist" },
  { $set: { price: 19.99 } }
);
//Delete a book by its title (e.g., "The Great Book")
db.books.deleteOne({ title: "Moby Dick" });

// ### Task 3: Advanced Queries
//  Write a query to find books that are both in stock and published after 2010
db.books.find(
  {
    stock: { $gt: 0 },
    published_year: { $gt: 2010 }
  },
  {
    title: 1,
    author: 1,
    price: 1,
    _id: 0
  }
);
// Use projection to return only the title, author, and price fields in your queries
// Implement sorting to display books by price (both ascending and descending)
// Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 }).skip(0).limit(5).pretty();

// Descending
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: -1 }).skip(0).limit(5).pretty();
// ### Task 4: Aggregation pipeline
// Create an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $match: {
      genre: { $exists: true },
      price: { $exists: true }
    }
  },
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
]).pretty();
// Create an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $match: {
      author: { $exists: true }
    }
  },
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 1
  }
]).pretty();
// Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $match: {
      published_year: { $exists: true }
    }
  },
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } * 10 },
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  },
  {
    $project: {
      decade: "$_id",
      bookCount: 1,
      _id: 0
    }
  }
]).pretty();
// ### Task 5: Indexing
// create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 });
// Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: 1 });
