-- CreateTable
CREATE TABLE "stream_location" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,

    CONSTRAINT "stream_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stream_location_streamId_key" ON "stream_location"("streamId");

-- AddForeignKey
ALTER TABLE "stream_location" ADD CONSTRAINT "stream_location_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
