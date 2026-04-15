
let homeScore = 12;
let guestScore = 5;

let timeLeft = 720; // 12 minutes
let timerInterval;
let voiceEnabled = false;
let availableVoices = [];
let lastSpeechIntensity = "normal";
let commentaryStyleIndex = 2;
const commentaryStyles = ["Calm", "Hype", "NBA"];

function pickRandom(options) {
    return options[Math.floor(Math.random() * options.length)];
}

function getCommentaryStyle() {
    return commentaryStyles[commentaryStyleIndex];
}

function getEnglishVoices() {
    const englishVoices = availableVoices.filter(function (voice) {
        return voice.lang && voice.lang.toLowerCase().startsWith("en");
    });

    return englishVoices.length ? englishVoices : availableVoices;
}

function pickVoiceByHints(voices, hints) {
    return voices.find(function (voice) {
        const voiceName = voice.name.toLowerCase();
        return hints.some(function (hint) {
            return voiceName.includes(hint);
        });
    });
}

function pickBestVoice() {
    const voices = getEnglishVoices();

    if (!voices.length) {
        return null;
    }

    const style = getCommentaryStyle();
    const calmVoiceHints = ["david", "mark", "daniel", "hazel", "susan", "heera", "rishi"];
    const hypeVoiceHints = ["zira", "aria", "jenny", "guy", "davis", "samantha", "nova", "alloy"];
    const nbaVoiceHints = ["guy", "davis", "matthew", "christopher", "eric", "jason", "roger"];

    if (style === "Calm") {
        return pickVoiceByHints(voices, calmVoiceHints) || voices[0];
    }

    if (style === "Hype") {
        return pickVoiceByHints(voices, hypeVoiceHints) || voices[0];
    }

    return pickVoiceByHints(voices, nbaVoiceHints)
        || pickVoiceByHints(voices, hypeVoiceHints)
        || voices[0];
}

function loadVoices() {
    availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}

loadVoices();

if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

function speakCommentary(message) {
    if (!voiceEnabled || !("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    const preferredVoice = pickBestVoice();

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    const style = getCommentaryStyle();

    if (style === "Calm") {
        if (lastSpeechIntensity === "high") {
            utterance.rate = 1.00 + Math.random() * 0.08;
            utterance.pitch = 1.00 + Math.random() * 0.10;
        } else if (lastSpeechIntensity === "medium") {
            utterance.rate = 0.94 + Math.random() * 0.08;
            utterance.pitch = 0.98 + Math.random() * 0.08;
        } else {
            utterance.rate = 0.88 + Math.random() * 0.06;
            utterance.pitch = 0.95 + Math.random() * 0.06;
        }
    } else if (style === "Hype") {
        if (lastSpeechIntensity === "high") {
            utterance.rate = 1.18 + Math.random() * 0.12;
            utterance.pitch = 1.38 + Math.random() * 0.20;
        } else if (lastSpeechIntensity === "medium") {
            utterance.rate = 1.08 + Math.random() * 0.10;
            utterance.pitch = 1.24 + Math.random() * 0.18;
        } else {
            utterance.rate = 1.00 + Math.random() * 0.08;
            utterance.pitch = 1.14 + Math.random() * 0.12;
        }
    } else {
        if (lastSpeechIntensity === "high") {
            utterance.rate = 1.24 + Math.random() * 0.12;
            utterance.pitch = 1.48 + Math.random() * 0.20;
        } else if (lastSpeechIntensity === "medium") {
            utterance.rate = 1.12 + Math.random() * 0.10;
            utterance.pitch = 1.30 + Math.random() * 0.18;
        } else {
            utterance.rate = 1.04 + Math.random() * 0.08;
            utterance.pitch = 1.16 + Math.random() * 0.12;
        }
    }
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    const voiceButton = document.getElementById("voice-toggle");
    voiceButton.textContent = voiceEnabled ? "Voice: On" : "Voice: Off";

    if (!voiceEnabled && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        return;
    }

    speakCommentary(document.getElementById("commentary").textContent);
}

function toggleCommentaryStyle() {
    commentaryStyleIndex = (commentaryStyleIndex + 1) % commentaryStyles.length;
    document.getElementById("style-toggle").textContent = `Style: ${getCommentaryStyle()}`;
    updateCommentary();
}

function setSpeechIntensity(level) {
    lastSpeechIntensity = level;
}

function getLeadComment(teamName, lead) {
    const style = getCommentaryStyle();

    if (style === "Calm") {
        if (lead >= 15) {
            setSpeechIntensity("medium");
            return pickRandom([
                `${teamName} have opened a very comfortable ${lead}-point lead.`,
                `${teamName} are in firm control with a ${lead}-point advantage.`,
                `${teamName} continue to lead convincingly by ${lead}.`
            ]);
        }

        if (lead >= 8) {
            setSpeechIntensity("medium");
            return pickRandom([
                `${teamName} are creating some separation now and lead by ${lead}.`,
                `${teamName} are in a good rhythm and hold an ${lead}-point lead.`,
                `${teamName} have built a solid cushion of ${lead} points.`
            ]);
        }

        if (lead >= 4) {
            setSpeechIntensity("normal");
            return pickRandom([
                `${teamName} hold a steady ${lead}-point lead.`,
                `${teamName} are in front by ${lead} and looking composed.`,
                `${teamName} lead by ${lead} as the game settles into rhythm.`
            ]);
        }

        setSpeechIntensity("normal");
        return pickRandom([
            `${teamName} are narrowly in front by ${lead}.`,
            `${teamName} have a slim ${lead}-point advantage.`,
            `${teamName} just edge it for now, leading by ${lead}.`
        ]);
    }

    if (style === "Hype") {
        if (lead >= 15) {
            setSpeechIntensity("high");
            return pickRandom([
                `${teamName} are absolutely taking over right now. They lead by ${lead}, and this place would be going crazy!`,
                `${teamName} are blowing the doors off this game with a ${lead}-point lead! This is unreal!`,
                `${teamName} are putting on a clinic and the lead is up to ${lead}! They are on fire!`
            ]);
        }

        if (lead >= 8) {
            setSpeechIntensity("high");
            return pickRandom([
                `${teamName} are catching absolute fire and lead by ${lead}!`,
                `${teamName} are building real distance now. It's ${lead}, and the energy is surging!`,
                `${teamName} are rolling and the lead is up to ${lead}! They can feel it now!`
            ]);
        }

        if (lead >= 4) {
            setSpeechIntensity("medium");
            return pickRandom([
                `${teamName} have the momentum and they lead by ${lead}!`,
                `${teamName} are starting to pull away here. It's ${lead}, and the pressure is on!`,
                `${teamName} are taking charge and lead by ${lead}! This game is heating up!`
            ]);
        }

        setSpeechIntensity("medium");
        return pickRandom([
            `${teamName} are just in front and this one is getting spicy!`,
            `${teamName} edge ahead, but this game is still on a knife edge!`,
            `${teamName} lead by ${lead}, and the tension in this one is climbing fast!`
        ]);
    }

    if (lead >= 15) {
        setSpeechIntensity("high");
        return pickRandom([
            `${teamName} are putting on a show right now. They lead by ${lead}, and this building is rocking! Are you kidding me!`,
            `${teamName} have blown this game wide open. It's a massive ${lead}-point advantage, and they are not letting up!`,
            `This is a statement run from ${teamName}. They are up ${lead} and pouring it on with authority!`
        ]);
    }

    if (lead >= 8) {
        setSpeechIntensity("medium");
        return pickRandom([
            `${teamName} are starting to seize control here with an ${lead}-point lead, and the momentum is all theirs.`,
            `${teamName} are on a serious run and have opened up an ${lead}-point cushion. This is championship-level stuff.`,
            `${teamName} have real separation now. They lead by ${lead}, and the pressure is mounting on the other side.`
        ]);
    }

    if (lead >= 4) {
        setSpeechIntensity("medium");
        return pickRandom([
            `${teamName} have the momentum right now and lead by ${lead}.`,
            `${teamName} are beginning to lean on them here. It's a ${lead}-point game and the intensity is rising.`,
            `${teamName} have found a real rhythm and lead by ${lead}. Listen to this crowd!`
        ]);
    }

    setSpeechIntensity("normal");
    return pickRandom([
        `${teamName} are in front by ${lead}, but this game is far from decided.`,
        `${teamName} edge ahead, and every possession matters now.`,
        `${teamName} lead by ${lead}. This one is getting tight down the stretch.`
    ]);
}

function getScoringComment(teamName, points, lead, isTie) {
    const style = getCommentaryStyle();

    if (style === "Calm") {
        if (isTie) {
            setSpeechIntensity("medium");
            if (points === 3) {
                return pickRandom([
                    `${teamName} hit the three, and the game is tied again.`,
                    `${teamName} connect from outside to draw level.`,
                    `${teamName} knock down a triple and tie the game.`
                ]);
            }
            return pickRandom([
                `${teamName} score and bring the game level.`,
                `${teamName} tie things up with that basket.`,
                `${teamName} answer nicely there, and we're tied.`
            ]);
        }

        if (lead === 1 && points >= 2) {
            setSpeechIntensity("medium");
            return pickRandom([
                `${teamName} move in front with that basket.`,
                `${teamName} take the lead on that possession.`,
                `${teamName} edge ahead with a timely score.`
            ]);
        }

        if (points === 3) {
            setSpeechIntensity("medium");
            return pickRandom([
                `${teamName} knock down the three.`,
                `${teamName} connect from long range.`,
                `${teamName} score from beyond the arc.`
            ]);
        }

        setSpeechIntensity(lead >= 8 ? "medium" : "normal");
        return pickRandom([
            `${teamName} add to their total and ${getLeadComment(teamName, lead)}`,
            `${teamName} get the basket and ${getLeadComment(teamName, lead)}`,
            `${teamName} score on that trip and ${getLeadComment(teamName, lead)}`
        ]);
    }

    if (style === "Hype") {
        if (isTie) {
            setSpeechIntensity("high");
            if (points === 3) {
                return pickRandom([
                    `${teamName} drills the three and we are tied up! That is a massive shot!`,
                    `Huge shot! ${teamName} tie it from deep and this game has exploded!`,
                    `${teamName} from downtown, and this game is level! What a moment!`
                ]);
            }
            return pickRandom([
                `${teamName} tie it up! This is getting wild!`,
                `${teamName} answer right back and we're all even! You can feel the swing!`,
                `${teamName} get the bucket and this game is tied again! What drama!`
            ]);
        }

        if (lead === 1 && points >= 2) {
            setSpeechIntensity("high");
            return pickRandom([
                `${teamName} take the lead! What a swing in momentum!`,
                `${teamName} move in front with a massive bucket! That is huge!`,
                `${teamName} grab the lead and the energy has shifted completely!`
            ]);
        }

        if (points === 3) {
            setSpeechIntensity("high");
            return pickRandom([
                `${teamName} lets it fly and buries the three! That is cold-blooded!`,
                `Splash! ${teamName} cash in from deep and the arena would be shaking!`,
                `${teamName} with a huge triple! That is a momentum breaker!`
            ]);
        }

        if (lead <= 3) {
            setSpeechIntensity("high");
            return pickRandom([
                `${teamName} score again and this game is absolutely alive!`,
                `${teamName} get the bucket and the pressure keeps climbing!`,
                `${teamName} punch back, and this one is intense!`
            ]);
        }

        setSpeechIntensity(lead >= 10 ? "high" : "medium");
        return pickRandom([
            `${teamName} keep coming! ${getLeadComment(teamName, lead)}`,
            `${teamName} stack another one on the board! ${getLeadComment(teamName, lead)}`,
            `${teamName} score again, and ${getLeadComment(teamName, lead)}`
        ]);
    }

    if (isTie) {
        setSpeechIntensity("high");
        if (points === 3) {
            return pickRandom([
                `Bang! ${teamName} from downtown, and we are tied up! That is a dagger of a three!`,
                `${teamName} knocks down the triple and this game is level! What a shot!`,
                `${teamName} lets it fly from deep and ties the game! Cold blooded! This is unreal!`
            ]);
        }
        return pickRandom([
            `${teamName} gets the bucket, and we are tied! What a response!`,
            `${teamName} answers on the other end, and this game is all even! You can feel the tension!`,
            `${teamName} comes right back and ties it up! This is playoff basketball!`
        ]);
    }

    if (lead === 1 && points >= 2) {
        setSpeechIntensity("high");
        return pickRandom([
            `${teamName} take the lead! What a response! That is superstar stuff!`,
            `${teamName} move in front with a huge bucket! That is a grown-man move!`,
            `${teamName} swing the game with that basket and grab the lead! This place is erupting!`
        ]);
    }

    if (points === 3) {
        setSpeechIntensity("high");
        return pickRandom([
            `From downtown! ${teamName} cash in from three! That is a bomb!`,
            `Splash! ${teamName} buries the triple! He is unconscious!`,
            `${teamName} from way outside, and that is pure! Absolute heat check!`
        ]);
    }

    if (lead >= 10) {
        setSpeechIntensity("high");
        return pickRandom([
            `${teamName} keep the pressure on. ${getLeadComment(teamName, lead)}`,
            `${teamName} are turning this into a runaway. ${getLeadComment(teamName, lead)}`,
            `${teamName} are putting together a brutal run right now. ${getLeadComment(teamName, lead)}`
        ]);
    }

    if (lead <= 3) {
        setSpeechIntensity("high");
        return pickRandom([
            `${teamName} score again, and the pressure is on!`,
            `${teamName} come right back, and this crowd would be on its feet!`,
            `${teamName} get the bucket, and you can feel the tension rising!`
        ]);
    }

    setSpeechIntensity("medium");
    return pickRandom([
        `${teamName} get the bucket, and ${getLeadComment(teamName, lead)}`,
        `${teamName} add two more, and ${getLeadComment(teamName, lead)}`,
        `${teamName} score on that trip, and ${getLeadComment(teamName, lead)}`
    ]);
}

function updateCommentary(lastScoringTeam = null, pointsScored = 0) {
    const commentaryEl = document.getElementById("commentary");
    const lead = Math.abs(homeScore - guestScore);
    const style = getCommentaryStyle();
    let message = "";

    if (homeScore === guestScore) {
        if (style === "Calm") {
            setSpeechIntensity("normal");
            message = pickRandom([
                "The teams are level right now, and it remains very finely balanced.",
                "Nothing separates them at the moment. It's tied.",
                "We are all square, with plenty still to play for."
            ]);
        } else if (style === "Hype") {
            setSpeechIntensity("high");
            message = pickRandom([
                "We're tied up and this one is getting electric!",
                "Nothing separates these teams right now. What a battle!",
                "It's all even, and you can feel the drama rising!"
            ]);
        } else {
            setSpeechIntensity("medium");
            message = pickRandom([
                "We are all tied up, and this one has the feel of an instant classic.",
                "Nothing separates these teams right now. What a ball game. This is special.",
                "It's tied, and every trip down the floor feels enormous right now."
            ]);
        }
    } else if (lastScoringTeam === "Home") {
        message = getScoringComment("Home", pointsScored, lead, homeScore === guestScore);
    } else if (lastScoringTeam === "Guest") {
        message = getScoringComment("Guest", pointsScored, lead, homeScore === guestScore);
    } else if (homeScore > guestScore) {
        message = getLeadComment("Home", lead);
    } else {
        message = getLeadComment("Guest", lead);
    }

    commentaryEl.textContent = message;
    speakCommentary(message);
}

function addHome(points) {
    homeScore += points;
    document.getElementById("home-score").textContent = homeScore;
    updateCommentary("Home", points);
}

function addGuest(points) {
    guestScore += points;
    document.getElementById("guest-score").textContent = guestScore;
    updateCommentary("Guest", points);
}

function newGame() {
    homeScore = 0;
    guestScore = 0;
    timeLeft = 720;

    document.getElementById("home-score").textContent = homeScore;
    document.getElementById("guest-score").textContent = guestScore;
    document.getElementById("game-status").textContent = "Game On";

    updateTimerDisplay();
    updateCommentary();
    stopTimer();
}

function setHalfTime() {
    document.getElementById("game-status").textContent = "Half Time";
    const style = getCommentaryStyle();
    setSpeechIntensity(style === "Calm" ? "normal" : style === "Hype" ? "high" : "medium");
    if (style === "Calm") {
        speakCommentary(pickRandom([
            "That brings us to halftime with the game still unfolding nicely.",
            "We are at the half, and there is still much to decide.",
            "Halftime now, with both teams still very much in this contest."
        ]));
        return;
    }
    if (style === "Hype") {
        speakCommentary(pickRandom([
            "Halftime! And this game has brought the energy!",
            "We hit the break, and this one is cooking!",
            "That's halftime, and the crowd would be buzzing!"
        ]));
        return;
    }
    speakCommentary(pickRandom([
        "That's the end of the first half, and this game has absolutely delivered on every level.",
        "We hit halftime with plenty still on the table in this one. This is high-level basketball.",
        "Halftime here, and what a first half we've had. This game has real star power."
    ]));
}

function setFullTime() {
    document.getElementById("game-status").textContent = "Full Time";
    const style = getCommentaryStyle();
    setSpeechIntensity(style === "Calm" ? "medium" : "high");
    if (style === "Calm") {
        speakCommentary(pickRandom([
            "Full time. That concludes the game.",
            "The final buzzer sounds, and the game is complete.",
            "That is the end of the contest."
        ]));
        return;
    }
    if (style === "Hype") {
        speakCommentary(pickRandom([
            "That's the game! What a finish!",
            "Final buzzer! This one is over!",
            "Game over! That was intense!"
        ]));
        return;
    }
    speakCommentary(pickRandom([
        "Final buzzer! That is the ball game! What a performance we just witnessed!",
        "That's it! This one is in the books, and this crowd got its money's worth!",
        "Game over! What a finish we just witnessed! That was primetime stuff!"
    ]));
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer").textContent = minutes + ":" + seconds;
}

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById("game-status").textContent = "Time's Up!";
            const style = getCommentaryStyle();
            setSpeechIntensity(style === "Calm" ? "medium" : "high");
            if (style === "Calm") {
                speakCommentary(pickRandom([
                    "The clock has expired.",
                    "Time is up on this one.",
                    "That is the end of regulation."
                ]));
            } else if (style === "Hype") {
                speakCommentary(pickRandom([
                    "The clock hits zero! What a moment!",
                    "No time left! That was huge!",
                    "Time expires and this place would be roaring!"
                ]));
            } else {
                speakCommentary(pickRandom([
                    "The clock hits zero! That may do it! What a sequence!",
                    "No time remaining! That is a massive moment in this game!",
                    "Time expires! What a dramatic finish! That was box office!"
                ]));
            }
            updateCommentary();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// initialize scoreboard on load
updateTimerDisplay();
updateCommentary();
document.getElementById("style-toggle").textContent = `Style: ${getCommentaryStyle()}`;
