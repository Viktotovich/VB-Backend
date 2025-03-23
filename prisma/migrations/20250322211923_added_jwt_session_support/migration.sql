-- CreateTable
CREATE TABLE "Session" (
    "token" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
