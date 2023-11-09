CREATE DATABASE wishties;

-- Create the User/Creator table
CREATE TABLE creator (
    creator_id SERIAL PRIMARY KEY,
    creator_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    creator_bio VARCHAR(160),
    email VARCHAR(256) NOT NULL,
    profile_image TEXT,
    cover_image TEXT
);

-- Create the Wishlist table
CREATE TABLE wishlists (
    wishlist_id SERIAL PRIMARY KEY,
    creator_id INT REFERENCES creator(creator_id),
    wish_category VARCHAR(100),
    wish_type VARCHAR(100)
);

-- Create the Wish table
CREATE TABLE wishes (
    wish_id SERIAL PRIMARY KEY,
    wishlist_id INT REFERENCES wishlists(wishlist_id),
    wish_name VARCHAR(256),
    price DECIMAL,
    wish_image TEXT
);

-- Create the Creator's Social Media Links table
CREATE TABLE social_media_links (
    link_id SERIAL PRIMARY KEY,
    creator_id INT REFERENCES creator(creator_id),
    platform_image TEXT,
    link TEXT,
    platform_name VARCHAR(150)
);

-- Create the Fan/Gift Sender table
CREATE TABLE fans (
    fan_id SERIAL PRIMARY KEY,
    fan_name VARCHAR(50) NOT NULL,
    fan_email VARCHAR(256),
    message_to_creator VARCHAR(256),
    supported_creator_id INT REFERENCES creator(creator_id)
);
