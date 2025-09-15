package uk.gov.hmcts.reform.dev.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import uk.gov.hmcts.reform.dev.dto.TaskCreateRequest;
import uk.gov.hmcts.reform.dev.dto.TaskResponse;
import uk.gov.hmcts.reform.dev.dto.TaskUpdateRequest;
import uk.gov.hmcts.reform.dev.models.TaskStatus;
import uk.gov.hmcts.reform.dev.services.TaskService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    private final LocalDateTime testDateTime = LocalDateTime.of(2024, 1, 1, 12, 0, 0);

    @Test
    void getAllTasks_ShouldReturnListOfTasks() throws Exception {
        TaskResponse taskResponse = new TaskResponse(1L, "Test Task", "Description", 
                TaskStatus.TODO, testDateTime, testDateTime, testDateTime);
        
        when(taskService.getAllTasks()).thenReturn(List.of(taskResponse));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Task"))
                .andExpect(jsonPath("$[0].status").value("TODO"));
    }

    @Test
    void getTaskById_WhenTaskExists_ShouldReturnTask() throws Exception {
        TaskResponse taskResponse = new TaskResponse(1L, "Test Task", "Description", 
                TaskStatus.TODO, testDateTime, testDateTime, testDateTime);
        
        when(taskService.getTaskById(1L)).thenReturn(Optional.of(taskResponse));

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    void getTaskById_WhenTaskNotExists_ShouldReturnNotFound() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTask_WithValidRequest_ShouldReturnCreatedTask() throws Exception {
        TaskCreateRequest request = new TaskCreateRequest("New Task", "Description", 
                TaskStatus.TODO, testDateTime);
        TaskResponse response = new TaskResponse(1L, "New Task", "Description", 
                TaskStatus.TODO, testDateTime, testDateTime, testDateTime);

        when(taskService.createTask(any(TaskCreateRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("New Task"));
    }

    @Test
    void createTask_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        TaskCreateRequest request = new TaskCreateRequest("", "Description", 
                null, null);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateTask_WhenTaskExists_ShouldReturnUpdatedTask() throws Exception {
        TaskUpdateRequest request = new TaskUpdateRequest("Updated Task", "Updated Description", 
                TaskStatus.IN_PROGRESS, testDateTime);
        TaskResponse response = new TaskResponse(1L, "Updated Task", "Updated Description", 
                TaskStatus.IN_PROGRESS, testDateTime, testDateTime, testDateTime);

        when(taskService.updateTask(eq(1L), any(TaskUpdateRequest.class))).thenReturn(Optional.of(response));

        mockMvc.perform(put("/api/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"));
    }

    @Test
    void updateTask_WhenTaskNotExists_ShouldReturnNotFound() throws Exception {
        TaskUpdateRequest request = new TaskUpdateRequest("Updated Task", "Updated Description", 
                TaskStatus.IN_PROGRESS, testDateTime);

        when(taskService.updateTask(eq(1L), any(TaskUpdateRequest.class))).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateTaskStatus_WhenTaskExists_ShouldReturnUpdatedTask() throws Exception {
        TaskResponse response = new TaskResponse(1L, "Test Task", "Description", 
                TaskStatus.COMPLETED, testDateTime, testDateTime, testDateTime);

        when(taskService.updateTaskStatus(1L, TaskStatus.COMPLETED)).thenReturn(Optional.of(response));

        mockMvc.perform(patch("/api/tasks/1/status")
                .param("status", "COMPLETED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void deleteTask_WhenTaskExists_ShouldReturnNoContent() throws Exception {
        when(taskService.deleteTask(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTask_WhenTaskNotExists_ShouldReturnNotFound() throws Exception {
        when(taskService.deleteTask(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNotFound());
    }
}