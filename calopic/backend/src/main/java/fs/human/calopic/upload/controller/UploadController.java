package fs.human.calopic.upload.controller;

import fs.human.calopic.upload.service.UploadService;
import fs.human.calopic.upload.vo.UploadVO;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000")
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

    // 추가: YOLO_ID 리스트로 조회
    @PostMapping("/foods/by-yolo")
    public List<UploadVO> getFoodsByYolo(@RequestBody YoloReq req) {
        List<String> yoloIds = req.getClassIds().stream().map(String::valueOf).distinct().toList();
        return uploadService.getFoodsByYoloIds(yoloIds);
    }

    public static class YoloReq {
        private List<Integer> classIds;
        public List<Integer> getClassIds() { return classIds; }
        public void setClassIds(List<Integer> classIds) { this.classIds = classIds; }
    }
}
