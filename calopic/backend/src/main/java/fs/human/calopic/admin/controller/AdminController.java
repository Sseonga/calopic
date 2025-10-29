// src/main/java/fs/human/calopic/admin/controller/AdminController.java
package fs.human.calopic.admin.controller;

import fs.human.calopic.admin.service.AdminService;
import fs.human.calopic.admin.vo.AdminVO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    // 예: GET /api/users?role=all | admin | user
    @GetMapping("/users")
    public List<AdminVO> getUsers(@RequestParam(defaultValue = "all") String role) {
        return adminService.getUsers(role);
    }

    @DeleteMapping("/users")
    public ResponseEntity<DeleteUsersResponse> deleteUsers(@RequestBody DeleteUsersRequest req) {
        int deleted = adminService.deleteUsers(req.getUserIds());
        return ResponseEntity.ok(new DeleteUsersResponse(deleted));
    }

    @GetMapping("/classes")
    public List<AdminVO> getClasses() {
        return adminService.getClasses();
    }


    // ✅ 신규 추가 — 음식 클래스 추가
    @PostMapping("/classes")
    public ResponseEntity<Map<String, Object>> addClass(@RequestBody AdminVO vo) {
        int inserted = adminService.addClass(vo); // insert 후 vo.foodId에 PK가 채워짐
        return ResponseEntity.ok(Map.of(
                "inserted", inserted,
                "item", vo  // foodId, foodName, foodKcal, foodCarbo, foodProtein, foodFat 포함
        ));
    }

    // ✅ 신규 추가 — 음식 클래스 삭제
    @DeleteMapping("/classes")
    public ResponseEntity<Map<String, Object>> deleteClasses(@RequestBody DeleteClassesRequest req) {
        int deleted = adminService.deleteClasses(req.getClassIds());
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }

    // 음식 이름 목록 조회
    @GetMapping("/classes/names")
    public List<String> getFoodNames() {
        return adminService.getFoodNames();
    }


    // 요청 바디 DTO: { "userIds": [18, 19, 20] }
    @Data
    public static class DeleteUsersRequest {
        private List<Long> userIds;
    }

    // 응답 DTO: { "deleted": 3 }
    @Data
    public static class DeleteUsersResponse {
        private final int deleted;
    }

    @GetMapping("/users/check")
    public void checkMapper() {
        adminService.checkMapperLoaded();
    }

    @Data
    public static class DeleteClassesRequest {
        private List<Long> classIds;
    }



}
