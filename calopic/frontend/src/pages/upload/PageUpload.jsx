// src/pages/PageUpload/PageUpload.jsx (경로는 프로젝트 구조에 맞게)
import React, { useState, useCallback } from "react";
import DietInfo from "../../components/upload/DietInfo";
import DietNutrientInfo from "../../components/upload/DietNutrientInfo";
import ImgUpload from "../../components/upload/ImgUpload";

export default function PageUpload() {
  // 총합 객체 상태: { calories, protein, carbs, fat }
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [detections, setDetections] = useState([]);  // ← AI 탐지 결과 저장

  const handleDetections = useCallback((evt) => {
    if (!evt) return;
    if (evt.type === 'add') {
      setDetections(prev => [...prev, ...evt.items]);            // uid가 붙은 감지 결과 누적
    } else if (evt.type === 'removeByUid') {
      setDetections(prev => prev.filter(d => d.sourceUid !== evt.uid)); // ← 핵심
    }
  }, []);

  const userId = localStorage.getItem('memberId') || localStorage.getItem('userId');

  return (
    <div>
      <ImgUpload onDetections={handleDetections}/>
      <div style={{ height: 50 }} />

      {/* DietInfo가 totals 객체를 올려줍니다 */}
      <DietInfo onTotalsChange={setTotals} detections={detections}/>

      <div style={{ height: 50 }} />

      {/* DietNutrientInfo에 totals 그대로 전달 */}
      <DietNutrientInfo totals={totals} userId={userId} />

      <div style={{ height: 50 }} 
      />
      {/* <button className="upload-to-diary-btn">내 다이어리에 저장</button> */}
    </div>
  );
}
