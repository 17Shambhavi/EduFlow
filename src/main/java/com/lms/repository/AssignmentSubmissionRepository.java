package com.lms.repository;

import com.lms.model.AssignmentSubmission;
import com.lms.model.User;
import com.lms.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    Optional<AssignmentSubmission> findByAssignmentAndStudent(Assignment assignment, User student);
    List<AssignmentSubmission> findByAssignment(Assignment assignment);
    List<AssignmentSubmission> findByStudent(User student);
    List<AssignmentSubmission> findByAssignmentAndGradedFalse(Assignment assignment);
}