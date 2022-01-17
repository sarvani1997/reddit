-- EXPLAIN ANALYSE SELECT * from "posts" WHERE "userId"='1';

-- DROP TABLE "upvotes"
SELECT * from "users" ;

-- EXPLAIN ANALYSE SELECT

--   "vote",
--   "createdAt",
--   "updatedAt",
--   "postId",
--   "userId"
-- FROM
--   "upvotes" AS "upvote"
-- WHERE
--   "upvote"."userId" = 1
--   AND "upvote"."postId" = '279';


-- ALTER TABLE "users" ADD "upvotes" INTEGER;

-- SELECT
--     tablename,
--     indexname,
--     indexdef
-- FROM
--     pg_indexes
-- WHERE
--     schemaname = 'public'
-- ORDER BY
--     tablename,
--     indexname;