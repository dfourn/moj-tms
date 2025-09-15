package uk.gov.hmcts.reform.dev.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.hmcts.reform.dev.dto.TaskCreateRequest;
import uk.gov.hmcts.reform.dev.dto.TaskResponse;
import uk.gov.hmcts.reform.dev.dto.TaskUpdateRequest;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;
import uk.gov.hmcts.reform.dev.repositories.TaskRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Optional<TaskResponse> getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(this::convertToResponse);
    }

    @Transactional
    public TaskResponse createTask(TaskCreateRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        
        Task savedTask = taskRepository.save(task);
        return convertToResponse(savedTask);
    }

    @Transactional
    public Optional<TaskResponse> updateTask(Long id, TaskUpdateRequest request) {
        return taskRepository.findById(id)
                .map(task -> {
                    if (request.getTitle() != null) {
                        task.setTitle(request.getTitle());
                    }
                    if (request.getDescription() != null) {
                        task.setDescription(request.getDescription());
                    }
                    if (request.getStatus() != null) {
                        task.setStatus(request.getStatus());
                    }
                    if (request.getDueDate() != null) {
                        task.setDueDate(request.getDueDate());
                    }
                    return convertToResponse(taskRepository.save(task));
                });
    }

    @Transactional
    public Optional<TaskResponse> updateTaskStatus(Long id, TaskStatus status) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setStatus(status);
                    return convertToResponse(taskRepository.save(task));
                });
    }

    @Transactional
    public boolean deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private TaskResponse convertToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}