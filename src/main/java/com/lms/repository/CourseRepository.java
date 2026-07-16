package com.lms.repository;

import com.lms.model.Course;
import com.lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByInstructor(User instructor);
    List<Course> findByStatus(Course.Status status);
    List<Course> findByCategory(String category);

    @Query("SELECT c FROM Course c WHERE " +
            "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Course> searchByKeyword(String keyword);

    @Query("SELECT c FROM Course c WHERE " +
            "(:category IS NULL OR c.category = :category) AND " +
            "(:level IS NULL OR c.level = :level) AND " +
            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
            "c.status = 'APPROVED'")
    List<Course> filterCourses(String category, String level,
                               Double minPrice, Double maxPrice);
}