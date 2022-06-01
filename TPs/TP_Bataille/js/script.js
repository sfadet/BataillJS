$(document).ready(
    function ($){
        $("#start").show();
        $("#jeu").hide();
        $("#end").hide();

        $("#fight").click(
            () => {
                tirerJeu()
            })

        $("#combat").click(
            ()=> {
                tirerCartes();
                }
            )

        $("#playAgain").click(
            ()=> {
                replay();
                }
            )
    }
)

let deckId = "";
let scoreJ1 = 0;
let scoreJ2 = 0;
let egalite = 0;

function showPlay(id, cards){
    deckId = id;
    updateRemainingCards(cards)
    $("#start").hide();
    $("#jeu").show();
}

// tirer un jeu de cartes
function tirerJeu(){
    $.ajax(
        {
            url:'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            method: 'GET'
        }
    )
        .done(
            (data) => showPlay(data.deck_id, data.remaining)
        )
    ;
}

// tirer des cartes
function tirerCartes(){
    $.ajax(
        {
            url:'https://deckofcardsapi.com/api/deck/'+deckId+'/draw/?count=2',
            method: 'GET'
        }
    )
        .done(
            (data) => bataille(data)
        )
    ;
}

// gestion d'une bataille
function bataille(data){
    updateRemainingCards(data.remaining)
    $("#imgJ1").html("<img src=\""+ data.cards[0].image +"\" alt=\"carte joueur 1\" >");
    $("#imgJ2").html("<img src=\""+ data.cards[1].image +"\" alt=\"carte joueur 2\" >");
    battle(cardValue(data.cards[0].value), cardValue(data.cards[1].value));
    if(data.remaining == 0){
        endGame();
    }
}

// Met à jour le nombre de cartes restantes
function updateRemainingCards(nb){
    $("h3").text("Cartes restantes : " + nb);
}

// bataille entre les 2 cartes
function battle(vJ1, vJ2){
    if(vJ1 > vJ2){
        scoreJ1++;
    }
    if (vJ1 < vJ2){
        scoreJ2++;
    }
    if (vJ1 == vJ2){
        egalite ++;
    }
    displayScores();
}

function displayScores(){
    $("#scoreJ1").text(scoreJ1);
    $("#scoreJ2").text(scoreJ2);
    $("#egalite").text(egalite);
}

// retourne la valeur d'une carte
function cardValue(value){
    let retour = 0;
    switch (value.charAt(0)){
        case 'A' :
            retour = 14;
            break;
        case 'K' :
            retour = 13;
            break;
        case 'Q' :
            retour = 12;
            break;
        case 'J' :
            retour = 11;
            break;
        default :
            retour = parseInt(value);
    }
    return retour;
}

// Gestion de la fin d'une partie
function endGame(){
    $("#combat").hide();
    if(scoreJ1 > scoreJ2) {
        $("#winner").text("Le gagnant est le Joueur 1");
    } else if (scoreJ1 < scoreJ2){
        $("#winner").text("Le gagnant est le Joueur 2");
    } else {
        $("#winner").text("egalité");
    }
    $("#end").show();
}

// rejouer
function replay(){
    $("#end").hide();
    $("#combat").show();
    $("#imgJ1").html("");
    $("#imgJ2").html("");
    scoreJ1 = 0;
    scoreJ2 = 0;
    egalite = 0;
    displayScores();
    tirerJeu();
}



