package com.lms.repository;

import com.lms.model.Review;
import com.lms.model.User;
import com.lms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourse(Course course);
    Optional<Review> findByCourseAndStudent(Course course, User student);
    boolean existsByCourseAndStudent(Course course, User student);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course = :course")
    Double findAverageRatingByCourse(Course course);
}