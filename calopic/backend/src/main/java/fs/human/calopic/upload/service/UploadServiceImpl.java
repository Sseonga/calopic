// UploadServiceImpl.java
package fs.human.calopic.upload.service;

import fs.human.calopic.upload.dao.UploadDAO;
import fs.human.calopic.upload.vo.UploadVO;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UploadServiceImpl implements UploadService {

    private final UploadDAO uploadDAO;

    public UploadServiceImpl(UploadDAO uploadDAO) {
        this.uploadDAO = uploadDAO;
    }

    @Override
    public List<UploadVO> getAllFood() {
        return uploadDAO.selectAllFood();
    }

    @Override
    public UploadVO getFoodByName(String foodName) {
        return uploadDAO.selectFoodByName(foodName);
    }
}
