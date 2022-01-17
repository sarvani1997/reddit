CREATE INDEX ON "posts"("userId");
CREATE INDEX ON "posts"("subredditId");
CREATE INDEX ON "comments"("userId");
CREATE INDEX ON "comments"("postId");