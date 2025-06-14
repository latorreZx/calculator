// Estado da calculadora
const calculatorState = {
  currentOperand: "0",
  previousOperand: "",
  operation: undefined,
};

// Elementos do DOM
const previousOperandElement = document.querySelector(".previous-operand");
const currentOperandElement = document.querySelector(".current-operand");

// Funções de manipulação de números
const clearCalculator = () => {
  calculatorState.currentOperand = "0";
  calculatorState.previousOperand = "";
  calculatorState.operation = undefined;
  updateDisplay();
};

const deleteDigit = () => {
  if (calculatorState.currentOperand === "0") return;
  calculatorState.currentOperand = calculatorState.currentOperand
    .toString()
    .slice(0, -1);
  if (calculatorState.currentOperand === "")
    calculatorState.currentOperand = "0";
  updateDisplay();
};

const appendNumber = (number) => {
  if (number === "." && calculatorState.currentOperand.includes(".")) return;
  if (calculatorState.currentOperand === "0" && number !== ".") {
    calculatorState.currentOperand = number;
  } else {
    calculatorState.currentOperand =
      calculatorState.currentOperand.toString() + number;
  }
  updateDisplay();
};

// Funções de operações
const chooseOperation = (operation) => {
  if (calculatorState.currentOperand === "0") return;
  if (calculatorState.previousOperand !== "") {
    compute();
  }
  calculatorState.operation = operation;
  calculatorState.previousOperand = calculatorState.currentOperand;
  calculatorState.currentOperand = "0";
  updateDisplay();
};

const compute = () => {
  const prev = parseFloat(calculatorState.previousOperand);
  const current = parseFloat(calculatorState.currentOperand);

  if (isNaN(prev) || isNaN(current)) return;

  const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "×": (a, b) => a * b,
    "÷": (a, b) => {
      if (b === 0) {
        showError("Não é possível dividir por zero!");
        return a;
      }
      return a / b;
    },
  };

  const operation = operations[calculatorState.operation];
  if (!operation) return;

  calculatorState.currentOperand = operation(prev, current).toString();
  calculatorState.operation = undefined;
  calculatorState.previousOperand = "";
  updateDisplay();
};

// Funções de formatação e exibição
const formatNumber = (number) => {
  const stringNumber = number.toString();
  const [integerPart, decimalPart] = stringNumber.split(".");

  const formattedInteger = isNaN(parseFloat(integerPart))
    ? "0"
    : parseFloat(integerPart).toLocaleString("pt-BR", {
        maximumFractionDigits: 0,
      });

  return decimalPart != null
    ? `${formattedInteger},${decimalPart}`
    : formattedInteger;
};

const updateDisplay = () => {
  currentOperandElement.innerText = formatNumber(
    calculatorState.currentOperand
  );

  if (calculatorState.operation != null) {
    previousOperandElement.innerText = `${formatNumber(
      calculatorState.previousOperand
    )} ${calculatorState.operation}`;
  } else {
    previousOperandElement.innerText = "";
  }
};

// Função para mostrar erros
const showError = (message) => {
  currentOperandElement.classList.add("error");
  setTimeout(() => {
    currentOperandElement.classList.remove("error");
  }, 500);
  alert(message);
};

// Event Listeners
document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.innerText));
});

document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => chooseOperation(button.innerText));
});

document.querySelector(".equals").addEventListener("click", compute);
document.querySelector(".clear").addEventListener("click", clearCalculator);
document.querySelector(".delete").addEventListener("click", deleteDigit);

// Inicialização
updateDisplay();
