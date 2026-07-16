package com.lms.service;

import com.lms.dto.QuizRequest;
import com.lms.model.*;
import com.lms.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CourseRepository courseRepository;

    public Quiz createQuiz(QuizRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found!"));

        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .timeLimitSeconds(request.getTimeLimitSeconds())
                .maxAttempts(request.getMaxAttempts())
                .passingScore(request.getPassingScore())
                .course(course)
                .build();

        Quiz saved = quizRepository.save(quiz);

        if (request.getQuestions() != null) {
            request.getQuestions().forEach(q -> {
                Question question = Question.builder()
                        .quiz(saved)
                        .questionText(q.getQuestionText())
                        .type(Question.QuestionType.valueOf(q.getType()))
                        .options(q.getOptions())
                        .correctAnswer(q.getCorrectAnswer())
                        .marks(q.getMarks())
                        .build();
                questionRepository.save(question);
            });
        }

        return saved;
    }

    public QuizAttempt submitQuiz(User student, Long quizId,
                                  Map<Long, String> answers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found!"));

        // Check max attempts
        Integer attempts = quizAttemptRepository.countByStudentAndQuiz(student, quiz);
        if (attempts >= quiz.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts reached!");
        }

        List<Question> questions = questionRepository.findByQuizId(quizId);

        double score = 0;
        int totalMarks = 0;

        for (Question question : questions) {
            totalMarks += question.getMarks();
            String submitted = answers.get(question.getId());
            if (submitted != null &&
                    submitted.equalsIgnoreCase(question.getCorrectAnswer())) {
                score += question.getMarks();
            }
        }

        boolean passed = (score / totalMarks * 100) >= quiz.getPassingScore();

        try {
            ObjectMapper mapper = new ObjectMapper();
            String answersJson = mapper.writeValueAsString(answers);

            QuizAttempt attempt = QuizAttempt.builder()
                    .quiz(quiz)
                    .student(student)
                    .score(score)
                    .totalMarks(totalMarks)
                    .passed(passed)
                    .submittedAnswers(answersJson)
                    .build();

            return quizAttemptRepository.save(attempt);
        } catch (Exception e) {
            throw new RuntimeException("Error saving quiz attempt!");
        }
    }

    public List<Quiz> getCourseQuizzes(Long courseId) {
        return quizRepository.findByCourseId(courseId);
    }

    public List<QuizAttempt> getMyAttempts(User student, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found!"));
        return quizAttemptRepository.findByStudentAndQuiz(student, quiz);
    }
}