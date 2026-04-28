package com.tutornet.repository;

import com.tutornet.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {

    /**
     * Fetches all announcements for a specific course.
     * OrderByCreatedAtDesc ensures the newest updates appear at the top of the student's feed.
     */
    List<Announcement> findByCourseIdOrderByCreatedAtDesc(UUID courseId);
}