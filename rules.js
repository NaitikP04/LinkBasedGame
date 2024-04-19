let acccesscode = false;
let unlocked = false;
let wrongcount = 0;

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = `key`; 
        this.engine.show(this.engine.storyData.Locations[key].Body); 
        
        if(this.engine.storyData.Locations[key].Choices) { 
            for(let choice of this.engine.storyData.Locations[key].Choices) { 
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }

        if (key === "Library") {
            this.engine.gotoScene(CustomSceneLib);
        }
        if (key === "LibraryUnlocked") {
            this.engine.gotoScene(LibraryUnlocked);
        }
        if (key === "Security Room") {
            this.engine.gotoScene(CustomSceneSecurity);
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {  
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

class CustomSceneLib extends Scene {
    
    constructor(engine) {
        super(engine);
        this.secretNumber = Math.floor(Math.random() * 1000) + 1; 
        this.remainingGuesses = 12; 
        this.playerGuess = ""; 
        this.debug = false; 
        this.listenerAdded = false;

        if (unlocked === true) {
            this.engine.gotoScene(Location, "LibraryUnlocked");
        }

        if (unlocked === false) {
            this.engine.show("Welcome to the library! As you browse through the shelves, you notice a mysterious keypad hidden among the books.");
            this.engine.show("Intrigued, you approach it to find a challenge: Guess the secret number between 1 and 1000 to unlock the hidden compartment in the bookshelf.");
    
            this.engine.show("You have 12 tries to guess the secret number. Enter your guess and press Enter:");
    
            if (this.debug) {
                console.log("Secret number:", this.secretNumber); 
            }
    
            if (!this.listenerAdded && unlocked === false) {
                document.addEventListener('keydown', this.handleKeyPress.bind(this));
                this.listenerAdded = true; 
                console.log("event listener added");
            }
        }
    }

    handleChoice(action) {
        if (this.listenerAdded === true && unlocked === false) {
            document.removeEventListener('keydown', this.handleKeyPress);
            console.log("event listener removed");
            this.listenerAdded = false; 
        }
        
        if (unlocked === false) {
            if (this.remainingGuesses <= 0 ) {
                this.engine.show("Sorry, you've run out of guesses. The secret number was " + this.secretNumber + ". Try again!");
                this.engine.gotoScene(Location, "Mantion Entrace");
            } else if (parseInt(this.playerGuess) === this.secretNumber) {
                this.engine.show("Congratulations! You've guessed the secret number " + this.secretNumber + " correctly!");
                unlocked = true;
                this.engine.gotoScene(Location, "LibraryUnlocked"); 
            } else {
                if (parseInt(this.playerGuess) < this.secretNumber) {
                    this.engine.show("Sorry, that's not the correct number. The secret number is higher. You have " + this.remainingGuesses + " guesses remaining. Enter another guess and press Enter:");
                } else {
                    this.engine.show("Sorry, that's not the correct number. The secret number is lower. You have " + this.remainingGuesses + " guesses remaining. Enter another guess and press Enter:");
                }
            }
        }
        if (unlocked === true) {
            return; 
        }

    }

    handleKeyPress(event) {
        if (event.key >= '0' && event.key <= '9') {
            this.playerGuess += event.key;
        } else if (event.key === 'Enter') {
            this.remainingGuesses--;
            this.handleChoice();
            this.playerGuess = "";
        }
        
    }
}

class CustomSceneSecurity extends Scene {
    constructor(engine) {
        super(engine);
        this.playerGuess = "";
        this.correctPassword = "12";
        this.listenerAdded = false; 
    
        this.engine.show("You try to enter the room but the door won't budge. Instead, you're confronted with a mysterious voice: \"what's the password\". It seems this room holds more than meets the eye.");
        this.engine.show("HINT: It's a 2-digit number. The answer lies somewhere in the mansion.");
        this.engine.show("Type the password and press Enter:");

        if (!this.listenerAdded) {
            document.addEventListener('keydown', this.handleKeyPress.bind(this));
            this.listenerAdded = true; 
            console.log("event listener added");
        }
    }

    handleChoice(action) {

        console.log(acccesscode);

        if (this.listenerAdded) {
            document.removeEventListener('keydown', this.handleKeyPress);
            console.log("event listener removed");
            this.listenerAdded = false; 
        }

        if (this.playerGuess === this.correctPassword) {
            this.engine.gotoScene(Location, "Security Room Unlocked");
            acccesscode = true;
        } else if (this.playerGuess != this.correctPassword && acccesscode == false){
            wrongcount++;
            if (wrongcount <= 1) {
                this.engine.show("Wrong password");
                this.engine.gotoScene(Location, "Main Hall");
                return;
            }
            else{
                wrongcount = 0;
                return;
            }
        }

    }

    handleKeyPress(event) {
        if (event.key >= '0' && event.key <= '9') {
            this.playerGuess += event.key;
        } else if (event.key === 'Enter') {
            this.handleChoice();
        }
    }
}

class LibraryUnlocked extends Scene {
    create(){
        if(acccesscode == true){
            this.engine.show("As you enter the correct password, you hear a faint click. Suddenly, the bookshelf in front of you slides open, revealing a hidden room bathed in dim light. You step inside and are greeted by the sight of the artifact you've been seeking, displayed prominently on a pedestal at the center of the room. The artifact emanates a mysterious aura, casting intricate shadows on the walls.");

            this.engine.show("You cautiously approach the artifact, marveling at its ancient craftsmanship. It exudes an undeniable allure, drawing you closer with each step. With a sense of both excitement and trepidation, you reach out and grasp the artifact, feeling its cool surface beneath your fingertips.");
            
            this.engine.show("As you hold the artifact, a sense of accomplishment washes over you. You've succeeded in your quest. With the artifact in hand, you make your way out of the hidden room and back into the library. The bookshelf slides back into place behind you, concealing the secret room once more.");
            
            this.engine.show("Congratulations! You've found the artifact and completed your mission. You win!");

            this.engine.gotoScene(End);
            return;

        }   
        else if (acccesscode == false){
            this.engine.show("You've unlocked the hidden room but the artefact remains locked. You must find the access code to unlock it.");
            this.engine.gotoScene(Location, "Main Hall");
        }
    }
}


Engine.load(Start, 'myStory.json');
//Pair Programming: Naitik Poddar, Zeke Davidson for the "Introduction" assignment. 
//Final implementation of the Link-Based done by Naitik Poddar. 