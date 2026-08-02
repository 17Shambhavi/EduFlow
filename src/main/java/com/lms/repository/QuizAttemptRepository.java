package com.lms.repository;

import com.lms.model.QuizAttempt;
import com.lms.model.User;
import com.lms.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentAndQuiz(User student, Quiz quiz);
    Integer countByStudentAndQuiz(User student, Quiz quiz);
    Optional<QuizAttempt> findTopByStudentAndQuizOrderByScoreDesc(User student, Quiz quiz);

    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa WHERE qa.quiz = :quiz")
    Double findAverageScoreByQuiz(Quiz quiz);
}