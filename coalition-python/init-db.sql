DROP DATABASE IF EXISTS coalition;
CREATE DATABASE coalition;
GRANT ALL PRIVILEGES ON DATABASE coalition TO postgres;
\c coalition

DROP TABLE IF EXISTS agency_domain_whitelist;
DROP TABLE IF EXISTS brokers;
DROP TABLE IF EXISTS agencies;


CREATE TABLE agency_domain_whitelist(
   id INT,
   domain VARCHAR(255) NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE agencies(
   id INT,
   title VARCHAR(255) NOT NULL,
   domain VARCHAR(255),
   agency_address TEXT,
   PRIMARY KEY(id)
);

CREATE TABLE brokers(
   id INT GENERATED ALWAYS AS IDENTITY,
   agency_id INT,
   firstname VARCHAR(255) NOT NULL,
   lastname VARCHAR(15),
   email VARCHAR(100),
   broker_address TEXT,
   PRIMARY KEY(id),
   UNIQUE(email),
   CONSTRAINT fk_agency
      FOREIGN KEY(agency_id) 
	  REFERENCES agencies(id)
);

INSERT INTO agency_domain_whitelist (id,domain) 
VALUES 
(1,'cyberrisksolved.com'),
(2,'cyberinsurance.com'),
(3,'cyberworld.com'),
(4,'savefromcyber.com'),
(5,'cyberunderwriting.com');

INSERT INTO agencies (id,title,domain,agency_address) 
VALUES 
(1,'Cyber Risk Solved Inc','cyberrisksolved.com','4418 N Rancho Dr, Las Vegas, NV 89130'),
(2,'Cyber Insurance LLC','cyberinsurance.com','2025 E Florence Ave, Los Angeles, CA 90001'),
(3,'Cyber World Inc, San Francisco','cyberworld.com','876 Geary St, San Francisco, CA 94109'),
(4,'Cyber World Inc, New York','cyberworld.com','148 W 72nd St, New York, NY 10023'),
(5,'Cyber World Inc, Miami','cyberworld.com','1575 SW 8th St, Miami, FL 33135');
