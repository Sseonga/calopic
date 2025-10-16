import React from "react";
import DietInfo from "../../components/upload/DietInfo";
import DietNutrientInfo from "../../components/upload/DietNutrientInfo";
import ImgUpload from "../../components/upload/ImgUpload";

export default function PageUpload() {
  return(
    <div>
      <ImgUpload/>
      <div style={{height: '50px'}}></div>
      <DietInfo/>
      <div style={{height: '50px'}}></div>
      <DietNutrientInfo/>  
      <div style={{height: '50px'}}></div>
    </div>
  )
}