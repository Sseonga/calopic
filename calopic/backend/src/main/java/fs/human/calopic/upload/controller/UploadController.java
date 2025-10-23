package fs.human.calopic.upload.controller;

import fs.human.calopic.upload.service.UploadService;
import fs.human.calopic.upload.vo.UploadVO;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    // 전체 음식 목록 (Select용)
    @GetMapping("/foods")
    public List<UploadVO> getAllFood() {
        return uploadService.getAllFood();
    }

    // 선택된 음식 상세 조회
    @GetMapping("/foods/{foodName}")
    public UploadVO getFoodByName(@PathVariable String foodName) {
        return uploadService.getFoodByName(foodName);
    }
}
