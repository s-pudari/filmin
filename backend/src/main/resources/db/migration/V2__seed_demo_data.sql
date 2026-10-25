-- V2: Seed demo data for Filmin Live Demo

-- Passwords are all 'password123' hashed with BCrypt
-- Hash: $2a$10$wE7Q3F3ZzK5I9zMvA3p9ieJd0W1hV7xX4f2eT6uY8oP1qR5sT3uVW (or standard valid BCrypt)

INSERT INTO users (id, email, password_hash, account_status, created_at)
VALUES 
    (1, 'aditi@filmin.demo', '$2a$10$Dow1m0vE7d90xI92.bM63.k8R91bVqL7Uj1vO.cT7zT9YwI5jKq5e', 'ACTIVE', CURRENT_TIMESTAMP),
    (2, 'vikram@filmin.demo', '$2a$10$Dow1m0vE7d90xI92.bM63.k8R91bVqL7Uj1vO.cT7zT9YwI5jKq5e', 'ACTIVE', CURRENT_TIMESTAMP),
    (3, 'karan@filmin.demo', '$2a$10$Dow1m0vE7d90xI92.bM63.k8R91bVqL7Uj1vO.cT7zT9YwI5jKq5e', 'ACTIVE', CURRENT_TIMESTAMP);

INSERT INTO profiles (user_id, display_name, primary_role, skills, location, bio, experience_years, portfolio_links, updated_at)
VALUES
    (1, 'Aditi Rao', 'Lead Actress', 'Method Acting, Classical Dance, Voice Modulation, Hindi, Telugu', 'Mumbai, India', 'Graduate of FTII Pune with 4 years stage and short film experience. Passionate about character-driven dramas.', 4, '[{"label":"IMDb","url":"https://www.imdb.com/name/nm0000001"},{"label":"Showreel","url":"https://vimeo.com/showreel-aditi"}]', CURRENT_TIMESTAMP),
    (2, 'Vikram Malhotra', 'Director & Producer', 'Direction, Screenwriting, Film Production, Storyboarding', 'Hyderabad, India', 'National Award winning indie film director heading CloudNine Cine Productions. Currently casting for upcoming indie feature.', 10, '[{"label":"IMDb","url":"https://www.imdb.com/name/nm0000002"},{"label":"Production House","url":"https://cloudninecine.example.com"}]', CURRENT_TIMESTAMP),
    (3, 'Karan Sharma', 'Cinematographer & Drone Op', 'ARRI Alexa, RED Monstro, Anamorphic Lenses, Drone Piloting, DaVinci Resolve', 'Bengaluru, India', 'Visual storyteller specializing in low-light dramatic framing and dynamic camera movement.', 6, '[{"label":"Showreel","url":"https://vimeo.com/karancine"}]', CURRENT_TIMESTAMP);

INSERT INTO opportunities (id, creator_id, title, opportunity_type, role_needed, description, location, deadline, status, created_at)
VALUES
    (1, 2, 'Lead Female Protagonist for Indie Drama "Echoes of Silence"', 'FEATURE_FILM', 'Lead Actress', 'Looking for an expressive female actor aged 24-30 to play the complex role of a wildlife biologist in the Western Ghats. Must speak fluent Hindi. 40 days shoot scheduled in December.', 'Mumbai / Western Ghats', '2026-11-30', 'OPEN', CURRENT_TIMESTAMP),
    (2, 2, 'Chief Editor for Psychological Thriller Short', 'SHORT_FILM', 'Video Editor', 'Seeking a sharp editor with experience in non-linear suspense storytelling. Proficiency in Premiere Pro / DaVinci Resolve required.', 'Remote / Hyderabad', '2026-11-15', 'OPEN', CURRENT_TIMESTAMP),
    (3, 3, 'Focus Puller / 1st AC for Neo-Noir Series', 'WEB_SERIES', 'Camera Assistant', 'Looking for an experienced 1st AC familiar with ARRI Alexa Mini LF and Cooke Anamorphic glass for a 6-episode OTT neo-noir thriller.', 'Bengaluru', '2026-12-05', 'OPEN', CURRENT_TIMESTAMP);

INSERT INTO applications (opportunity_id, applicant_id, cover_message, status, submitted_at, updated_at)
VALUES
    (2, 1, 'Hi Vikram, I have worked on 3 narrative shorts with suspense editing pacing. Would love to collaborate!', 'SHORTLISTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
