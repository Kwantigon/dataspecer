-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataSpecification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pimSchema" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "artifactsConfiguration" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_DataSpecification" ("id", "pimSchema", "storeId", "tags") SELECT "id", "pimSchema", "storeId", "tags" FROM "DataSpecification";
DROP TABLE "DataSpecification";
ALTER TABLE "new_DataSpecification" RENAME TO "DataSpecification";
CREATE UNIQUE INDEX "DataSpecification_pimSchema_key" ON "DataSpecification"("pimSchema");
CREATE UNIQUE INDEX "DataSpecification_storeId_key" ON "DataSpecification"("storeId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
