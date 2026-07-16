package com.lms.repository;

import com.lms.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySectionIdOrderByOrderIndexAsc(Long sectionId);
    Integer countBySectionId(Long sectionId);
    void deleteBySectionId(Long sectionId);
}