package fs.human.calopic.layout.vo;

import lombok.Data;

@Data
public class LayoutVO {
    private Long userId;
    private String userName;   // 필요 시 확장
    private String isAdmin;   // 'Y' 또는 'N'
}
