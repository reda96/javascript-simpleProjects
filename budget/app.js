// IIFE Immediately Invoked Function Expression
const budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentages(data.totals.inc);
      });
    },
    getPercentages: function () {
      return data.allItems.exp.map((curr) => curr.getPercentage());
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    deleteItem: function (type, id) {
      let ids, index;
      ids = data.allItems[type].map((current) => current.id);
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };
  var formatNumber = function (num, type) {
    var numSplit, int, dec, type;
    /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function (selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
      let type;
      type = obj.budget > 0 ? "inc" : "exp";
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentages: function (percentages) {
      let fields;
      fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      const nodeListForEach = function (list, callback) {
        for (let index = 0; index < list.length; index++) {
          callback(list[index], index);
        }
      };
      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displayMonth: function () {
      var now, months, month, year;

      now = new Date();
      //var christmas = new Date(2016, 11, 25);

      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
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
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };
  const updateBudget = function () {
    // calc the budget
    budgerCtrl.calculateBudget();
    // return the budget
    const budget = budgerCtrl.getBudget();
    // display the budget
    UICtrl.displayBudget(budget);
  };
  const updatePercentages = function () {
    // 1. calculate percentages
    budgerCtrl.calculatePercentages();
    // 2. read the percentages from the budget controller
    let percentages = budgerCtrl.getPercentages();
    // 3. update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };
  const ctrlDeleteItem = function (event) {
    let itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // 1. delete the item from the data structure
      budgerCtrl.deleteItem(type, ID);
      // 2. delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. update and show the new budget
      updateBudget();
      // 4. update the percentages
      updatePercentages();
    }
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
      // calc and update percentages
      updatePercentages();
    }
  };
  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayMonth();
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
