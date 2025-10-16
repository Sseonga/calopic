import React, {useState} from "react";
import DietInfo from "../../components/upload/DietInfo";
import DietNutrientInfo from "../../components/upload/DietNutrientInfo";
import ImgUpload from "../../components/upload/ImgUpload";

export default function PageUpload() {
  // 총 칼로리 props 전달
  const [totalKcal, setTotalKcal] = useState(0);


  return(
    <div>
      <ImgUpload/>
      <div style={{height: '50px'}}></div>
      <DietInfo
        onTotalChange={setTotalKcal}
      />
      <div style={{height: '50px'}}></div>
      <DietNutrientInfo
        totalKcal={totalKcal}
      />  
      <div style={{height: '50px'}}></div>
    </div>
  )
}