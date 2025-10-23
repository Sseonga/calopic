// UploadService.java
package fs.human.calopic.upload.service;

import fs.human.calopic.upload.vo.UploadVO;

import java.util.List;

public interface UploadService {
    List<UploadVO> getAllFood();
    UploadVO getFoodByName(String foodName);
}
