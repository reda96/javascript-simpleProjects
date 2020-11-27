// IIFE Immediately Invoked Function Expression
const budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };
  return {
    addItem: function (type, des, val) {
      let newItem, ID;
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      if (type === "exp") {
        newItem = new Expense(ID, des, val);

        data.totals.exp += val;
      } else {
        newItem = new Income(ID, des, val);

        data.totals.inc += val;
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function () {
      let exp = 0;
      let inc = 0;
      // calculate the total expenses
      data.allItems.exp.forEach(function (current, index) {
        exp += current.value;
      });
      data.totals.exp = exp;
      // calaulate the total incomes
      data.allItems.inc.forEach(function (current, index) {
        inc += current.value;
      });

      data.totals.inc = inc;
      // calculate the budget
      data.budget = inc - exp;
      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})();

const UIController = (function () {
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // it will be inc either exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    addListItem: function (obj, type) {
      let html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function () {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

const Controller = (function (budgerCtrl, UICtrl) {
  const setupEventListeners = function () {
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        ctrlAddItem();
      }
    });
  };
  const updateBudget = function () {
    // calc the budget
    budgerCtrl.calculateBudget();
    // return the budget
    const budget = budgerCtrl.getBudget();
    // display the budget
    console.log(budget);
    UICtrl.displayBudget(budget);
  };
  const ctrlAddItem = function () {
    // Get the Input
    var input = UICtrl.getInput();
    if (input.descrition !== "" && !isNaN(input.value) && input.value > 0) {
      // add it to the budget controller
      const newItem = budgerCtrl.addItem(
        input.type,
        input.description,
        input.value
      );
      // add the new item to the user interface
      UICtrl.addListItem(newItem, input.type);
      // clear the fields
      UICtrl.clearFields();
      // calc and update the budget
      updateBudget();
    }
  };
  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

Controller.init();
