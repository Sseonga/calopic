package fs.human.calopic.layout.vo;

import lombok.Data;

@Data
public class LayoutVO {
    private Long userId;
    private String userEmail;  // 필요 시 프론트 표기용
    private String userName;   // 필요 시 확장
}
