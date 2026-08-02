package com.lms.repository;

import com.lms.model.ForumReply;
import com.lms.model.ForumThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {
    List<ForumReply> findByThreadOrderByCreatedAtAsc(ForumThread thread);
    Integer countByThread(ForumThread thread);
}