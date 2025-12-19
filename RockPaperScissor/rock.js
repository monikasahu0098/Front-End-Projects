let userScore=0;
let computerScore=0;

let choices=document.querySelectorAll(".choice");
let msg=document.querySelector("#msg");
let userScorePara=document.querySelector("#user-score");
let computerScorePara=document.querySelector("#computer-score");

const genComputerChoice=()=>{
    const option=["rock","paper","scissors"];
    const randomIdx=Math.floor(Math.random()*3);
    return option[randomIdx];
}
const drawGame=()=>{
    // console.log("Game is draw");
    msg.innerText="Game is draw.Play again!";
    msg.style.backgroundColor="#081b31";

}
const showWinner=(userWin,userChoice,computerChoice)=>{
    if(userWin){
        userScore++;
        userScorePara.innerText=userScore;
        msg.innerText=`You won the game! Your ${userChoice} beats ${computerChoice}`;
        msg.style.backgroundColor="green";
    }else{
        computerScore++;
        computerScorePara.innerText=computerScore;
        msg.innerText=`You lost the game! ${computerChoice} beats your ${userChoice}`;
        msg.style.backgroundColor="red";
    }
}
const playGame=(userChoice)=>{
    // console.log("user choice=",userChoice);
    const computerChoice=genComputerChoice();
    // console.log("computer choice=",computerChoice);

    if(userChoice===computerChoice){
        drawGame();
    }else{
        let userWin=true;
        if(userChoice==="rock"){
            //scissors ,paper
            userWin=computerChoice==="paper"? false :true;
        }else if(userChoice==="paper"){
            //rock,scissors
            userWin=computerChoice==="rock"? true:false;
        }else{
            //rock,paper
            userWin=computerChoice==="rock"? false:true;
        }
        showWinner(userWin,userChoice,computerChoice);
    }
}

choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        const userChoice=choice.getAttribute("id");
        playGame(userChoice);
    });
});