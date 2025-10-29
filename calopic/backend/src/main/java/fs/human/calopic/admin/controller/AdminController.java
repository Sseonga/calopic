// src/main/java/fs/human/calopic/admin/controller/AdminController.java
package fs.human.calopic.admin.controller;

import fs.human.calopic.admin.service.AdminService;
import fs.human.calopic.admin.vo.AdminVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
