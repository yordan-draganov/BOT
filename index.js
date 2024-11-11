async function recordGameSession(num1, num2, num3, won) {
    try {
        const response = await fetch('http://localhost:5000/saveGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                result: won ? 'win' : 'lose',
                reels: [num1, num2, num3],
                spins: 10
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const message = document.getElementById('message');
        const currentMessage = message.innerText;
        message.innerText = currentMessage + ' (Saved!)';
    } catch (error) {
        console.error('Error recording game session:', error);
        const message = document.getElementById('message');
        message.innerText += ' (Error saving result)';
    }
}

document.getElementById('spinButton').addEventListener('click', function() {
    const spinButton = document.getElementById('spinButton');
    const balanceDisplay = document.getElementById('balance');
    const message = document.getElementById('message');
    let balance = parseInt(balanceDisplay.innerText);
    const betAmount = 10;

    if (balance < betAmount) {
        message.innerText = "Insufficient balance!";
        return;
    }

    spinButton.disabled = true;
    balance -= betAmount;
    balanceDisplay.innerText = balance;

    function getRandomNumber() {
        const weightedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 1, 1];
        return weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];
    }

    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    let spins = 10;
    let spinCount = 0;
    message.innerText = "";
    
    const spinInterval = setInterval(() => {
        const num1 = getRandomNumber();
        const num2 = getRandomNumber();
        const num3 = getRandomNumber();

        reel1.innerText = num1;
        reel2.innerText = num2;
        reel3.innerText = num3;

        reel1.style.transform = 'scale(1.1)';
        reel2.style.transform = 'scale(1.1)';
        reel3.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            reel1.style.transform = 'scale(1)';
            reel2.style.transform = 'scale(1)';
            reel3.style.transform = 'scale(1)';
        }, 50);

        spinCount++;
        if (spinCount >= spins) {
            clearInterval(spinInterval);
            spinButton.disabled = false;

            const won = reel1.innerText === reel2.innerText && reel2.innerText === reel3.innerText;
            
            if (won) {
                message.innerText = "You win!";
                balance += betAmount * 10;
                balanceDisplay.innerText = balance;
            } else {
                message.innerText = "Try again!";
            }
            
            recordGameSession(
                parseInt(reel1.innerText),
                parseInt(reel2.innerText),
                parseInt(reel3.innerText),
                won
            );
        }
    }, 100);
});
