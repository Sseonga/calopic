package fs.human.calopic.upload.controller;

import fs.human.calopic.upload.service.UploadService;
import fs.human.calopic.upload.vo.UploadVO;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
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

//    // 추가: 유저 성별 조회 API
//    @GetMapping("/user/info/{userId}")
//    public UploadVO getUserGender(@PathVariable String userId) {
//        return uploadService.getUserGender(userId);
//    }
    @GetMapping("/user/info/{userId}")
    public ResponseEntity<?> getUserGender(@PathVariable String userId) {
        log.info("[GET] /api/upload/user/info/{} 호출", userId);
        var vo = uploadService.getUserGender(userId);
        if (vo == null || vo.getUserGender() == null) {
            log.warn("TB_USER_INFO 조회 결과 없음 userId={}", userId);
            return ResponseEntity.status(404).body(Map.of("message","NOT_FOUND","userId",userId));
        }
        log.info("조회 성공 userId={} userGender={}", vo.getUserId(), vo.getUserGender());
        // 파싱 혼선을 막기 위해 간단하게 내려줌
        return ResponseEntity.ok(Map.of("userId", vo.getUserId(), "userGender", vo.getUserGender()));
    }
}
