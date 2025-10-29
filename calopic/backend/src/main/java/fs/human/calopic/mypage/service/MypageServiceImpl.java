package fs.human.calopic.mypage.service;

import fs.human.calopic.mypage.mapper.MypageMapper;
import fs.human.calopic.mypage.vo.MypageVO;
import fs.human.calopic.user.dao.UserDAO;
import fs.human.calopic.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MypageServiceImpl implements MypageService {

    private final MypageMapper mypageMapper;
    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    @Override
    public MypageVO getUserInfo(Long userId) {
        return mypageMapper.findMypageByUserId(userId);
    }

    @Override
    @Transactional
    public void saveUserInfo(MypageVO userInfo) {
        userInfo.setUserId(userInfo.getUserId()); // userId가 설정되었는지 확인 (보안 강화)
        mypageMapper.upsertMypage(userInfo);
    }

    // ️ 비밀번호 변경 구현
    @Override
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        // 1. userId로 현재 사용자 정보(특히 비밀번호) 조회
        //    UserDAO에 findUserById 메소드가 없다면 findByUserName을 사용하거나 새로 만들어야 합니다.
        //    여기서는 ID가 Long 타입이므로 findUserById를 가정합니다.
        UserVO currentUser = userDAO.findUserById(userId); // ⭐️ UserDAO에 findUserById 메소드 추가 필요
        if (currentUser == null) {
            throw new RuntimeException("사용자 정보를 찾을 수 없습니다.");
        }

        // 2. 입력된 현재 비밀번호와 DB의 비밀번호 비교
        if (!passwordEncoder.matches(currentPassword, currentUser.getUserPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 3. 새 비밀번호 해싱
        String hashedNewPassword = passwordEncoder.encode(newPassword);

        // 4. DB에 새 비밀번호 업데이트
        int updatedRows = userDAO.updatePasswordById(userId, hashedNewPassword); // ⭐️ UserDAO에 updatePasswordById 메소드 추가 필요
        if (updatedRows == 0) {
            throw new RuntimeException("비밀번호 변경에 실패했습니다.");
        }
    }

    // ️ 회원 탈퇴 구현
    @Override
    @Transactional
    public void withdrawAccount(Long userId) {
        // 1. 관련 정보(신체 정보) 먼저 삭제 (FK 제약조건 위배 방지)
        mypageMapper.deleteUserInfoByUserId(userId); // ⭐️ MypageMapper에 deleteUserInfoByUserId 메소드 추가 필요

        // 2. 사용자 계정 삭제
        int deletedRows = userDAO.deleteUserById(userId); // ⭐️ UserDAO에 deleteUserById 메소드 추가 필요

        if (deletedRows == 0) {
            throw new RuntimeException("회원 탈퇴 처리 중 오류가 발생했습니다.");
        }
    }
}