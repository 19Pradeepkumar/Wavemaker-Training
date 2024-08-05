
function arthimeticExpressions(num) {
    let data = document.getElementById("demo").value 
    if(data!="0") data+=num;
    else data = num;
    document.getElementById("demo").value =data
}
function oneByX(val) {
    let num = '';
    let i;
    stringOnscreen = document.getElementById("demo").value
    document.getElementById("demo").value = eval(1/stringOnscreen)
}

function myfunctionEqualsto() {
    let totalValue;
    totalValue = eval(document.getElementById("demo").value)
    document.getElementById("demo").value = totalValue
}

function squareRoot(val) {
    console.log(stringOnscreen);
    document.getElementById("demo").value = Math.sqrt(stringOnscreen)
}

function editingElements(val) {
    if (val === "backspace") {
        let firstNumber = document.getElementById("demo").value
        firstNumber = firstNumber.slice(0, -1)
        document.getElementById("demo").value = firstNumber
    }
    if (val === "clearEverything") {
        document.getElementById("demo").value = ""
    }
    if (val === "PlusandMinus") {
        document.getElementById("demo").value = -(document.getElementById("demo").value)
    }
}


let storingNumber=0;

function storeAndRetrieve(val) {
    let numberatScreen = document.getElementById("demo").value
    switch (val) {
        case "MS": storingNumber = numberatScreen
            document.getElementById("demo").value=0
            break;
        case "MC": storingNumber = ""
        document.getElementById("demo").value=0
            break;
        case "MR": document.getElementById("demo").value = storingNumber
            break;
        case "M+": document.getElementById("demo").value = eval(numberatScreen + '+' + storingNumber)
            break;
        case "M-": document.getElementById("demo").value = eval(numberatScreen + '-' + storingNumber)
            break;
    }
}
