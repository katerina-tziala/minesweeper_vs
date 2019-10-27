class DigitalCounter {
    constructor(containerID) { 
        this.digitalCounterElement = document.getElementById(containerID);
        this.createDigitalCounterHTML();
        this.counterNumber = null;
        this.updateCounterDisplay();
    }

    createDigitalCounterHTML() {
        for (let index = 0; index < 3; index++) {
            this.digitalCounterElement.append(this.createDigitElementHTLM());
        }
    }

    createDigitElementHTLM() {
        const digit = document.createElement("div");
        digit.classList.add(Constants.digitClassList.digit);
        for (let index = 1; index < 8; index++) {
            const elementClassList = [Constants.digitClassList.digitLine];
            (index === 1 || index === 4 || index===7) ? elementClassList.push(Constants.digitClassList.digitLineIdentifier + "horizontal") : elementClassList.push(Constants.digitClassList.digitLineIdentifier + "vertical");
            elementClassList.push(Constants.digitClassList.digitLineIdentifier + index.toString());
            digit.append(this.createDigitLineHTML(elementClassList));
        }
        return digit;
    }

    createDigitLineHTML(classList) {
        const element = document.createElement("div");
        classList.forEach(className => {
            element.classList.add(className);
        });
        return element;
    }

    setCounter(number, color = null) {
        this.counterNumber = number;
        this.updateCounterDisplay(color);
    }

    updateCounterDisplay(color = null) {
        if (this.counterNumber === null) {
            this.initializeCounterDisplay();
            return;
        }
        const digitsArray = this.counterNumber.toString().split("");
        if (this.counterNumber < 0) {
            digitsArray.shift();
            digitsArray.reverse();
            digitsArray.push("minus");
        } else {
            digitsArray.reverse();
        }
        const digitElements = this.digitalCounterElement.querySelectorAll(`.${Constants.digitClassList.digit}`);
        for (let index = 0; index < digitElements.length; index++) {
            this.displayDigit(digitElements[index], Constants.digitPositions[digitsArray[index]], color);
        }
    }


    initializeCounterDisplay() {
        const digitElements = this.digitalCounterElement.querySelectorAll(`.${Constants.digitClassList.digit}`);
        for (let index = 0; index < digitElements.length; index++) {
            this.displayDigit(digitElements[index],  []);
        }
    }


    displayDigit(digitElement, linePositions, color = null) {
        const digitLines = digitElement.querySelectorAll(`.${Constants.digitClassList.digitLine}`);
        for (let index = 0; index < digitLines.length; index++) {
            digitLines[index].classList.remove(Constants.digitClassList.digitLineOn);
            digitLines[index].style.borderColor = null;
            digitLines[index].style.boxShadow = null;
            if (linePositions && linePositions.includes(index)) {
                digitLines[index].classList.add(Constants.digitClassList.digitLineOn);
                if(color){
                    digitLines[index].style.borderColor = color;
                    digitLines[index].style.boxShadow = `0px 0px 4px ${color}`;
                }
            }
        }
    }

    updateCounterColor(color) {
        const digitLinesOn = document.querySelectorAll(`.${Constants.digitClassList.digitLineOn}`);
        digitLinesOn.forEach(line => {
            line.style.borderColor = color;
            line.style.boxShadow = `0px 0px 4px ${color}`;
        });
    }
}