DROP DATABASE IF EXISTS products_DB;

CREATE DATABASE products_DB;

USE products_DB;

 -- Create a table called 'products' which will contain the store inventory --
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Blender', 'Housewares', 50, 5),
       ('Stand Mixer', 'Housewares', 100, 2),
       ('Scooby-Doo Anthology', 'Movies and TV', 20, 10),
       ('Count Duckula Complete Collection', 'Movies and TV', 34, 5),
       ('The Count of Monte Cristo', 'Books', 5, 3),
       ('Hallucinations by Oliver Sacks', 'Books', 10, 5),
       ('LED Monitor', 'Electronic', 100, 1),
       ('Bluetooth Mouse', 'Electronics', 55, 3),
       ('Darth Vader Doll', 'Toys', 500, 1),
       ('Lego Millenium Falcon', 'Toys', 100, 2);
