import React from 'react'


export default function Answers({ text, selectAnswer, isSelected, isCorrect, isChecked }){
    
    const stylingBeforeCheck = isSelected ? 'selected' : '' 
    
    function stylingAfterCheck(){
        if(isCorrect) {
            return "correct"
        } if(isSelected && !isCorrect) {
            return "incorrect opacity50"
        } else {
            return "opacity50"
        }
    }

    return (
        <button 
            className={`question-answer ${!isChecked ? stylingBeforeCheck : stylingAfterCheck() }`}
            onClick={selectAnswer}
        >
        {text} 
        </button>
    )
        
}