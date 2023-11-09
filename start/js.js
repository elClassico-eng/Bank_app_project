"use strict";

const account1 = {
    owner: "Dmitrii Fokeev",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    pin: 1111,
};

const account2 = {
    owner: "Anna Filimonova",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    pin: 2222,
};

const account3 = {
    owner: "Polina Filimonova",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    pin: 3333,
};

const account4 = {
    owner: "Stanislav Ivanchenko",
    movements: [430, 1000, 700, 50, 80],
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Вывод на страницу всех приходов и уходов
function displayMovements(movements, sort = false) {
    containerMovements.innerHTML = "";

    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach((value, index) => {
        const type = value > 0 ? "deposit" : "withdrawal"; // если value > 0, тогда депозит, а иначе withdrawal(красный)
        const typeMessage = value > 0 ? "Внесение" : "Снятие";
        const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${typeMessage}
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
}

//Создание нового ключ-значения logIn в аккаунты
function createLogin(accs) {
    accs.forEach((acc) => {
        acc.logIn = acc.owner
            .toLowerCase()
            .split(" ")
            .map((value) => {
                return value[0];
            })
            .join("");
    });
}
createLogin(accounts);

//Вывод на экран баланса
function calcBalanceMovements(acc) {
    acc.balance = acc.movements.reduce((acc, value) => {
        return acc + value;
    });
    labelBalance.textContent = `${acc.balance} RUB`;
}

//Вывод на экран, приход, уход и общий баланс
function sumBalance(movements) {
    const balanceIn = movements
        .filter((value) => value > 0)
        .reduce((acc, value) => acc + value);
    const balanceOut = movements
        .filter((value) => value < 0)
        .reduce((acc, val) => acc + val);
    const balanceInterest = balanceIn + balanceOut;
    labelSumIn.textContent = `${balanceIn}₽`;
    labelSumOut.textContent = `${Math.abs(balanceOut)}₽`;
    labelSumInterest.textContent = `${balanceInterest}₽`;
}

//Запуск функций
function updateUi(acc) {
    displayMovements(acc.movements);
    calcBalanceMovements(acc);
    sumBalance(acc.movements);
}

//Вход в аккаунт
let currentAccount;
btnLogin.addEventListener("click", (element) => {
    element.preventDefault();
    currentAccount = accounts.find(
        (acc) => acc.logIn === inputLoginUsername.value
    );
    console.log(currentAccount);
    if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
        containerApp.style.opacity = 100;
        inputLoginPin.value = inputLoginUsername.value = "";
        updateUi(currentAccount);
    }
});

//Перевод средств на другой счет
btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();
    const reciveAcc = accounts.find(
        (acc) => acc.logIn === inputTransferTo.value
    );
    const amount = Number(inputTransferAmount.value);
    console.log(amount, reciveAcc);
    if (
        reciveAcc &&
        amount > 0 &&
        currentAccount.balance >= amount &&
        reciveAcc.logIn !== currentAccount.logIn
    ) {
        inputTransferTo.value = inputTransferAmount.value = "";
        currentAccount.movements.push(-amount);
        reciveAcc.movements.push(amount);
        updateUi(currentAccount);
    }
});

const index = accounts.findIndex((acc) => acc.logIn === "af");

btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        inputCloseUsername.value === currentAccount.logIn &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(
            (acc) => acc.logIn === currentAccount.logIn
        );
        inputCloseUsername.value = inputClosePin.value = "";
        console.log(index);
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
    }
});

btnLoan.addEventListener("click", (e) => {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (amount > 0) {
        currentAccount.movements.push(amount);
        updateUi(currentAccount);
    }
    inputLoanAmount.value = "";
});

const allBalance = accounts
    .map((acc) => acc.movements)
    .flat()
    .reduce((acc, val) => acc + val);

let sorted = false;
btnSort.addEventListener("click", (e) => {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});

labelBalance.addEventListener("click", () => {
    Array.from(
        document.querySelectorAll(".mmovements__value"),
        (val, i) => (val.innerText = val.textContent.replace("₽", "RUB"))
    );
});
