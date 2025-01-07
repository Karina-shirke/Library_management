SELECT * FROM library_management.borrow_records;
ALTER TABLE books ADD COLUMN is_borrowed BOOLEAN DEFAULT FALSE;


DROP TABLE IF EXISTS borrow_records;

CREATE TABLE borrow_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  borrow_date DATETIME DEFAULT NOW(),
  return_date DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);
DESCRIBE borrow_records;

SHOW TABLES LIKE 'borrow_records';
DESCRIBE users;
DESCRIBE books;
SELECT id, title, is_borrowed FROM books WHERE id = 1;
UPDATE books SET is_borrowed = 0 WHERE id = 1;
INSERT INTO books (title, author_id, published_date, genre) 
VALUES ('Book Title', 1, '2025-01-01', 'Fiction');
UPDATE books
SET published_date = '2025-01-01'
WHERE published_date IS NULL;
SELECT * FROM books
SELECT * FROM authors WHERE id = 1;
INSERT INTO authors (name) VALUES ('J.K. Rowling');
SELECT * FROM authors WHERE id = 5;
SHOW CREATE TABLE books;
SELECT * FROM books;
SELECT * FROM authors;


