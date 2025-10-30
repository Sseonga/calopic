// src/main/java/fs/human/calopic/admin/vo/AdminVO.java
package fs.human.calopic.admin.vo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
public class AdminVO {
    private Long userId;          // USER_ID
    private String isAdmin;       // IS_ADMIN: 'Y' or 'N'
    private String userName;      // USER_NAME
    private String userQuestion;  // USER_QUESTION (라벨로 조인하면 여기 라벨을 넣어도 됨)
    private String userAnswer;    // USER_ANSWER

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdDate; // CREATED_DATE

    private Long foodId;
    private String foodName;
    private Double foodKcal;
    private Double foodCarbo;
    private Double foodProtein;
    private Double foodFat;
    private Long yoloId;
    private Double qtyCoeffi;
}
