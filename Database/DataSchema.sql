CREATE DATABASE wishties;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the User/Creator table
CREATE TABLE creator (
    creator_id UUID PRIMARY KEY, -- Creator's ID
    creator_name VARCHAR(50) NOT NULL, -- Creator's name
    username VARCHAR(50) UNIQUE NOT NULL, -- Creator's username
    creator_bio VARCHAR(160), -- Creator's bio
    pwd VARCHAR(256) NOT NULL, -- Creator's password
    email VARCHAR(256) UNIQUE NOT NULL, --  Creator's email
    profile_image TEXT, -- Creator's profile image
    cover_image TEXT, -- Creator's cover image
    created_at TIMESTAMP DEFAULT NOW(), -- Creator's account creation date
    verification_token VARCHAR(512), -- Creator's verification code
    is_verified BOOLEAN DEFAULT FALSE, -- Creator's verification status
    stripe_account_id VARCHAR(50), -- Store the connected Stripe account ID
    is_stripe_connected VARCHAR(10) DEFAULT 'INACTIVE' -- Store the Stripe connection status
);

CREATE TABLE payout (
    payout_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    creator_id UUID REFERENCES creator(creator_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL, -- Pending, Completed, Failed, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    stripe_transfer_id VARCHAR(50) -- Store the Stripe Transfer ID if applicable
);

CREATE TABLE stripe_account (
  stripe_account_id VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
  creator_id UUID REFERENCES creator(creator_id) ON DELETE CASCADE,
  email VARCHAR(255), -- Set not null & unique in production
  business_profile JSONB,
  capabilities JSONB,
  country VARCHAR(2),
  created TIMESTAMP WITH TIME ZONE,
  default_currency VARCHAR(3)
);

-- Create the Wish table
CREATE TABLE wishes (
    wish_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    creator_id UUID REFERENCES creator(creator_id) ON DELETE CASCADE, -- wishlist_id UUID REFERENCES wishlist
    wish_name VARCHAR(256) NOT NULL,
    wish_price NUMERIC NOT NULL,
    wish_image TEXT NOT NULL,
    wish_category VARCHAR(150),
    wish_type VARCHAR(150), -- To check if it's a single buy or a subscription
    created_date TIMESTAMP DEFAULT NOW()
    -- purchased BOOLEAN DEFAULT FALSE, -- To check if the wish has been purchased or not but I will implement this later
    -- deleted_at TIMESTAMP DEFAULT NULL -- To check if the wish has been purchased then delete it but I will implement this later as well
);

-- Create the Creator's Social Media Links table
CREATE TABLE social_media_links (
    link_id VARCHAR(100),
    creator_id UUID REFERENCES creator(creator_id) ON DELETE CASCADE,
    platform_name VARCHAR(150),
    platform_icon TEXT, platform_link TEXT,
    CONSTRAINT fk_creator_id_social_media
    FOREIGN KEY (creator_id) REFERENCES creator(creator_id) ON DELETE CASCADE
);
CREATE INDEX idx_creator_id ON creator (creator_id);

-- Create the Fan/Gift Sender table
CREATE TABLE fan (
    fan_id UUID PRIMARY KEY,
    fan_name VARCHAR(50),
    fan_email VARCHAR(256) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- This table to store the creators that the fan has supported and bought gifts for.
CREATE TABLE creators_fan_supported (
    fan_id UUID REFERENCES fan(fan_id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creator(creator_id) ON DELETE CASCADE,
    PRIMARY KEY (fan_id, creator_id),
    is_fan_supported BOOLEAN DEFAULT FALSE, -- To check if the fan has actually bought the wishes and supported the creator
    supported_number_of_time INT DEFAULT 0, -- The number of times the fan has supported the creator
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create the Fan's Gift Purchases table
CREATE TABLE purchases_info (
    purchase_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    fan_id UUID REFERENCES fan(fan_id) ON DELETE CASCADE,
    purchased_gifts INT DEFAULT 0,
    wish_info JSONB,
    amount_spent DECIMAL(10, 2) DEFAULT 0.00,
    purchase_identifier VARCHAR(50) UNIQUE NOT NULL,
    is_purchase_completed BOOLEAN DEFAULT FALSE,
    purchase_date TIMESTAMP DEFAULT NOW()
);

-- Create the Fan's Messages table
CREATE TABLE fan_messages (
    message_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    fan_id UUID REFERENCES fan(fan_id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creator(creator_id) ON DELETE CASCADE,
    message_text TEXT,
    purchase_identifier VARCHAR(50) UNIQUE NOT NULL,
    is_to_publish BOOLEAN DEFAULT FALSE, -- If this is set to true, the message will not be published to the creator
    sent_at TIMESTAMP DEFAULT NOW()
);

-- Leave this for now, I will come back to it later. May be useful for the future, they are not necessary for now.
-- Create the Fan's Gift Purchases table
CREATE TABLE purchases (
    purchase_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    fan_id UUID REFERENCES fan(fan_id) ON DELETE CASCADE,
    wish_id UUID REFERENCES wish(wish_id) ON DELETE CASCADE,
    purchased_for UUID REFERENCES creator(creator_id) ON DELETE CASCADE, -- The creator the gift is purchased for
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
    received_creator_id UUID REFERENCES creator(creator_id) ON DELETE CASCADE,
    received_from UUID REFERENCES fan(fan_id) ON DELETE SET NULL,
    received_number_of_wishes INT DEFAULT 0,
    received_wish_id UUID REFERENCES wish(wish_id) ON DELETE SET NULL,
    received_date TIMESTAMP DEFAULT NOW(), 
    CONSTRAINT fk_received_creator_id FOREIGN KEY (received_creator_id) 
    REFERENCES creator(creator_id) ON DELETE CASCADE,
    CONSTRAINT fk_received_from FOREIGN KEY (received_from) REFERENCES fan(fan_id) ON DELETE SET NULL,
    CONSTRAINT fk_received_wish_id FOREIGN KEY (received_wish_id) REFERENCES wish(wish_id) ON DELETE SET NULL,
    INDEX (received_creator_id), INDEX (received_from), INDEX (received_wish_id)
);
