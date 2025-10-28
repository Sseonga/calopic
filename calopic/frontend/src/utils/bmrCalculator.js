// src/utils/bmrCalculator.js

/**
 * Mifflin-St Jeor 공식을 사용하여 기초대사량(BMR)을 계산합니다.
 * @param {string} gender 성별 코드 ('GENDER01' for male, 'GENDER02' for female)
 * @param {number} weight 체중 (kg)
 * @param {number} height 키 (cm)
 * @param {number} age 나이 (years) - 임시로 30 사용
 * @returns {number | string} 계산된 BMR 값 (정수) 또는 'XXX'
 */
export const calculateMifflinStJeorBMR = (gender, weight, height, age = 30) => {
    if (!gender || !weight || !height || !age) {
        return 'XXX'; // 필요한 정보가 없으면 계산 불가
    }

    let bmr = 0;
    // 공식 적용: BMR = (10 * 체중kg) + (6.25 * 키cm) - (5 * 나이) + (성별 상수)
    if (gender === 'GENDER01') { // 남성
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else if (gender === 'GENDER02') { // 여성
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
        return 'XXX'; // 성별 코드가 유효하지 않은 경우
    }

    return Math.round(bmr); // 소수점 반올림하여 정수로 반환
};