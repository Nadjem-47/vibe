-- CreateTable
CREATE TABLE "Usage" (
    "key" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("key")
);
