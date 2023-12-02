CREATE DATABASE wishties;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the User/Creator table
CREATE TABLE creator (
creator_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY, -- Creator's ID
 creator_name VARCHAR(50) NOT NULL, -- Creator's name
 username VARCHAR(50) UNIQUE NOT NULL, -- Creator's username
 creator_bio VARCHAR(160), -- Creator's bio
pwd VARCHAR(256) NOT NULL, -- Creator's password
 email VARCHAR(256) UNIQUE NOT NULL, --  Creator's email
 profile_image TEXT, -- Creator's profile image
 cover_image TEXT, -- Creator's cover image
 created_at TIMESTAMP DEFAULT NOW() -- Creator's account creation date
);

-- Create the Wishlist table
CREATE TABLE wishlist (
    wishlist_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    creator_id UUID REFERENCES creator(creator_id),
    wish_category VARCHAR(150),
    wish_type VARCHAR(150),
    CONSTRAINT fk_creator_id FOREIGN KEY (creator_id) REFERENCES creator(creator_id) ON DELETE CASCADE,
    INDEX (creator_id)
);

-- Create the Wish table
CREATE TABLE wish (
    wish_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    wishlist_id UUID REFERENCES wishlist(wishlist_id),
    wish_name VARCHAR(256) NOT NULL,
    price NUMERIC NOT NULL,
    wish_image TEXT,
    wish_link TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    purchased BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_wishlist_id
    FOREIGN KEY (wishlist_id) REFERENCES wishlist(wishlist_id) ON
    DELETE CASCADE,
    INDEX (wishlist_id)
);

-- Create the Creator's Social Media Links table
CREATE TABLE social_media_links (
    link_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    creator_id UUID REFERENCES creator(creator_id),
    platform_name VARCHAR(150),
    platform_image TEXT,
    link TEXT,
    CONSTRAINT fk_creator_id_social_media
    FOREIGN KEY (creator_id) REFERENCES creator(creator_id) ON
    DELETE CASCADE,
    INDEX (creator_id)
);

-- Create the Fan/Gift Sender table
CREATE TABLE fan (
    fan_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    fan_name VARCHAR(50) NOT NULL,
    fan_email VARCHAR(256) UNIQUE NOT NULL,
    message_to_creator VARCHAR(256),
    supported_creator_id UUID REFERENCES creator(creator_id),
    purchased_gifts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(), 
);

-- Create the Fan's Gift Purchases table

CREATE TABLE purchases (
    purchase_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    fan_id UUID REFERENCES fan(fan_id),
    wish_id UUID REFERENCES wish(wish_id),
    purchased_for UUID REFERENCES creator(creator_id), -- Changed data type
    purchase_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_fan_id
    FOREIGN KEY (fan_id) REFERENCES fan(fan_id) ON DELETE CASCADE,
    CONSTRAINT fk_wish_id
    FOREIGN KEY (wish_id) REFERENCES wish(wish_id) ON DELETE CASCADE,
    CONSTRAINT fk_purchased_for
    FOREIGN KEY (purchased_for) REFERENCES creator(creator_id) ON DELETE SET NULL,
    INDEX (fan_id), INDEX (wish_id), INDEX (purchased_for)
);

-- Create the creator's gift receiving history table

CREATE TABLE creator_gift_receiving_history ( 
    receiving_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    received_creator_id UUID REFERENCES creator(creator_id), 
    received_from UUID REFERENCES fan(fan_id), 
    received_number_of_wishes INT DEFAULT 0,
    received_wish_id UUID REFERENCES wish(wish_id), 
    received_date TIMESTAMP DEFAULT NOW(), 
    CONSTRAINT fk_received_creator_id FOREIGN KEY (received_creator_id) 
    REFERENCES creator(creator_id) ON DELETE CASCADE,
    CONSTRAINT fk_received_from FOREIGN KEY (received_from) REFERENCES fan(fan_id) ON DELETE SET NULL,
    CONSTRAINT fk_received_wish_id FOREIGN KEY (received_wish_id) REFERENCES wish(wish_id) ON DELETE SET NULL,
    INDEX (received_creator_id), INDEX (received_from), INDEX (received_wish_id)
);
