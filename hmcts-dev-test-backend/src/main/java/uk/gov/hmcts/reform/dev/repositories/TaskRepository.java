package uk.gov.hmcts.reform.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByDueDateBetween(LocalDateTime start, LocalDateTime end);
    
    List<Task> findByStatusOrderByDueDateAsc(TaskStatus status);
    
    List<Task> findAllByOrderByCreatedAtDesc();
}