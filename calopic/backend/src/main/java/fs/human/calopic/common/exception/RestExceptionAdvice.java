// src/main/java/fs/human/calopic/common/exception/RestExceptionAdvice.java
package fs.human.calopic.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class RestExceptionAdvice {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValid(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .findFirst().map(fe -> fe.getDefaultMessage()).orElse("요청 값이 올바르지 않습니다.");
        return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", msg
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAny(Exception e) {
        return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "서버 오류가 발생했습니다."
        ));
    }
}
