package uk.gov.hmcts.reform.dev.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.hmcts.reform.dev.dto.TaskCreateRequest;
import uk.gov.hmcts.reform.dev.dto.TaskResponse;
import uk.gov.hmcts.reform.dev.dto.TaskUpdateRequest;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.models.TaskStatus;
import uk.gov.hmcts.reform.dev.repositories.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task testTask;
    private final LocalDateTime testDateTime = LocalDateTime.of(2024, 1, 1, 12, 0, 0);

    @BeforeEach
    void setUp() {
        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setStatus(TaskStatus.TODO);
        testTask.setDueDate(testDateTime);
        testTask.setCreatedAt(testDateTime);
        testTask.setUpdatedAt(testDateTime);
    }

    @Test
    void getAllTasks_ShouldReturnAllTasks() {
        when(taskRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(testTask));

        List<TaskResponse> result = taskService.getAllTasks();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Task");
        assertThat(result.get(0).getId()).isEqualTo(1L);
    }

    @Test
    void getTaskById_WhenTaskExists_ShouldReturnTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        Optional<TaskResponse> result = taskService.getTaskById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Task");
        assertThat(result.get().getId()).isEqualTo(1L);
    }

    @Test
    void getTaskById_WhenTaskNotExists_ShouldReturnEmpty() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<TaskResponse> result = taskService.getTaskById(1L);

        assertThat(result).isEmpty();
    }

    @Test
    void createTask_ShouldCreateAndReturnTask() {
        TaskCreateRequest request = new TaskCreateRequest("New Task", "Description", 
                TaskStatus.TODO, testDateTime);
        
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskResponse result = taskService.createTask(request);

        assertThat(result.getTitle()).isEqualTo("Test Task");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void updateTask_WhenTaskExists_ShouldUpdateAndReturnTask() {
        TaskUpdateRequest request = new TaskUpdateRequest("Updated Task", "Updated Description", 
                TaskStatus.IN_PROGRESS, testDateTime.plusDays(1));
        
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        Optional<TaskResponse> result = taskService.updateTask(1L, request);

        assertThat(result).isPresent();
        verify(taskRepository).save(testTask);
    }

    @Test
    void updateTask_WhenTaskNotExists_ShouldReturnEmpty() {
        TaskUpdateRequest request = new TaskUpdateRequest("Updated Task", "Updated Description", 
                TaskStatus.IN_PROGRESS, testDateTime);
        
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<TaskResponse> result = taskService.updateTask(1L, request);

        assertThat(result).isEmpty();
        verify(taskRepository, never()).save(any());
    }

    @Test
    void updateTaskStatus_WhenTaskExists_ShouldUpdateStatusAndReturnTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        Optional<TaskResponse> result = taskService.updateTaskStatus(1L, TaskStatus.COMPLETED);

        assertThat(result).isPresent();
        verify(taskRepository).save(testTask);
    }

    @Test
    void updateTaskStatus_WhenTaskNotExists_ShouldReturnEmpty() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<TaskResponse> result = taskService.updateTaskStatus(1L, TaskStatus.COMPLETED);

        assertThat(result).isEmpty();
        verify(taskRepository, never()).save(any());
    }

    @Test
    void deleteTask_WhenTaskExists_ShouldReturnTrue() {
        when(taskRepository.existsById(1L)).thenReturn(true);

        boolean result = taskService.deleteTask(1L);

        assertThat(result).isTrue();
        verify(taskRepository).deleteById(1L);
    }

    @Test
    void deleteTask_WhenTaskNotExists_ShouldReturnFalse() {
        when(taskRepository.existsById(1L)).thenReturn(false);

        boolean result = taskService.deleteTask(1L);

        assertThat(result).isFalse();
        verify(taskRepository, never()).deleteById(any());
    }
}