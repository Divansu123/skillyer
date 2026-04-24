-- Migration: Add professional fields to applications and qualification to enrollments
-- Run this SQL on your MySQL database

-- Add new columns to applications table
ALTER TABLE applications
  ADD COLUMN qualification VARCHAR(191) NULL,
  ADD COLUMN experience VARCHAR(191) NULL,
  ADD COLUMN currentCtc VARCHAR(191) NULL,
  ADD COLUMN expectedCtc VARCHAR(191) NULL,
  ADD COLUMN noticePeriod VARCHAR(191) NULL,
  ADD COLUMN currentOrg VARCHAR(191) NULL;

-- Add qualification column to enrollments table
ALTER TABLE enrollments
  ADD COLUMN qualification VARCHAR(191) NULL;

-- Add source column to enrollments (manual = admin added, public = portal)
ALTER TABLE enrollments ADD COLUMN source VARCHAR(20) NOT NULL DEFAULT 'manual';
