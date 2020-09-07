-- Efeito cascata
ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipes_files"
DROP CONSTRAINT recipes_files_file_id_fkey,
ADD CONSTRAINT recipes_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;