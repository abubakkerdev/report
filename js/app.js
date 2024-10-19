let addTableList = document.querySelector(".addTableList");
const toastLiveExample = document.getElementById("liveToast");
const reportClear = document.getElementById("reportClear");
const profitShow = document.getElementById("profitShow");
const toolsInputReset = document.getElementById("toolsInputReset");
let editTableList = document.querySelector(".editTableList");

function updateClockBangladesh() {
  const options = {
    timeZone: "Asia/Dhaka",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formattedTime = new Date().toLocaleTimeString("en-US", options);
  document.getElementById("clock").textContent = formattedTime;
}
// Update the clock immediately and then every second
updateClockBangladesh();
setInterval(updateClockBangladesh, 1000);

// convert text to table
let reportCreate = document.getElementById("reportCreate");
let resetText = document.getElementById("reset");

resetText.addEventListener("click", () => {
  let stockInfo = document.getElementById("stockInfo");
  stockInfo.value = "";
});

reportClear.addEventListener("click", () => {
  localStorage.removeItem("tableJsonFile");
  localStorage.removeItem("editTableJsonFile");
});

toolsInputReset.addEventListener("click", () => {
  let toolsInput = document.getElementById("toolsInput");
  toolsInput.value = "";
  document.getElementById("showAllProfit").innerHTML = "";
});

profitShow.addEventListener("click", () => {
  let toolsInput = document.getElementById("toolsInput");
  let inputValue = toolsInput.value.split(",").map((el) => Number(el));

  if (inputValue[3] === 1) {
    let win = `${inputValue[0]} WIN .80$ profit &nbsp; = &nbsp; ${
      inputValue[0] * 0.8
    }$ <br>`;
    let loss = `${inputValue[2]} LOSS .80$ profit &nbsp; = &nbsp; -${
      inputValue[2] * 2
    }$ <br>`;
    let martingale = `${
      inputValue[1]
    } Martingale .60$ profit &nbsp; = &nbsp; ${(inputValue[1] * 0.6).toFixed(
      2
    )}$ <br>`;
    let overallProfit = `Overall Profit &nbsp; = &nbsp; ${(
      inputValue[0] * 0.8 +
      inputValue[1] * 0.6 -
      inputValue[2] * 2
    ).toFixed(2)}$`;

    document.getElementById(
      "showAllProfit"
    ).innerHTML = `${win} ${loss} ${martingale} ${overallProfit}`;
  } else {
    let win = `${inputValue[0]} WIN ${(0.8 * inputValue[3]).toFixed(
      2
    )}$ profit &nbsp; = &nbsp; ${(
      inputValue[0] *
      (0.8 * inputValue[3])
    ).toFixed(2)}$ <br>`;

    let loss = `${inputValue[2]} LOSS ${(0.8 * inputValue[3]).toFixed(
      2
    )}$ profit &nbsp; = &nbsp; -${(inputValue[2] * 2 * inputValue[3]).toFixed(
      2
    )}$ <br>`;

    let martingale = `${inputValue[1]} Martingale ${(
      0.8 * inputValue[3]
    ).toFixed(2)}$ profit &nbsp; = &nbsp; ${(
      inputValue[1] * 0.8 * (inputValue[3] * 2) -
      inputValue[1] * inputValue[3]
    ).toFixed(2)}$ <br>`;

    let overallProfit = `Overall Profit &nbsp; = &nbsp; ${(
      inputValue[0] * (0.8 * inputValue[3]) +
      (inputValue[1] * 0.8 * (inputValue[3] * 2) -
        inputValue[1] * inputValue[3]) -
      inputValue[2] * 2 * inputValue[3]
    ).toFixed(2)}$`;

    document.getElementById(
      "showAllProfit"
    ).innerHTML = `${win} ${loss} ${martingale} ${overallProfit}`;
  }
});

reportCreate.addEventListener("click", () => {
  let stockInfo = document.getElementById("stockInfo");
  let removedSpace = stockInfo.value.replace(/\s+/g, "");

  if (removedSpace.split(";")[0].match(/OTC/gi)) {
    // Add a delimiter between each entry to separate them
    const modifiedStr = removedSpace.replace(/([A-Z]{6}-OTC)/g, ",$1");
    // Split the string into segments based on the new delimiter
    const segments = modifiedStr.split(",").filter(Boolean);
    // Convert each segment into an array of 3 elements
    const convertStringToArr = segments.map((segment) => segment.split(";"));
    if (convertStringToArr.length !== 0) {
      let uniqueCurrency = [
        ...new Set([...convertStringToArr.map((currency) => currency[0])]),
      ];

      let tableJsonFile = uniqueCurrency.map((currencyName) => {
        let convertStringToArrSort = convertStringToArr.sort((a, b) => {
          const timeA = a[1];
          const timeB = b[1];

          // Compare the times
          return timeA.localeCompare(timeB);
        });

        let timeSchedule = convertStringToArrSort
          .map((el, index) => el[0] === currencyName && [...el, index + 1])
          .filter((el) => el !== false);

        let tradingTimeData = timeSchedule.map((timeText) => [
          `${timeText[1]}; &nbsp; ${timeText[2]}`,
        ]);
        let positionData = timeSchedule.map((timeText) => [timeText[2]]);
        let uniqueIDData = timeSchedule.map((id) => [id[3]]);
        let checkedArr = new Array(tradingTimeData.length).fill(false);
        let winOrLossArr = new Array(tradingTimeData.length).fill(false);

        return {
          currencyName: currencyName,
          tradingTime: tradingTimeData,
          uniqueID: uniqueIDData,
          position: positionData,
          checked: checkedArr,
          winOrLoss: winOrLossArr,
        };
      });

      let tableListData = "";
      tableJsonFile.map((element, index) => {
        tableListData += `
        <tr>
          <th rowspan='${element.tradingTime.length}' scope="row">#${
          index + 1
        }</th>
          <td rowspan='${element.tradingTime.length}'>${
          element.currencyName
        }</td>
          <td>${element.tradingTime[0]}</td>
          <td class="uniqueID">${element.uniqueID[0]}</td>
          <td>${
            element.position[0][0] === "CALL"
              ? '<span class="up"></span>'
              : '<span class="down"></span>'
          }</td>
          <td>
            <div class="form-check form-switch"><input class="form-check-input switchCheck" type="checkbox" role="switch" ${
              element.checked[0] && "checked"
            } onclick="switchCheck('${element.uniqueID[0]}', this)" ></div>
          </td>
          <td>
            <div class="form-check" >
              <input class="form-check-input winOrLoss" ${
                element.winOrLoss[0] && "checked"
              } type="checkbox" onclick="winOrLoss('${
          element.uniqueID[0]
        }', this)">
            </div>
          </td>

        </tr>`;

        element.tradingTime.map((data, indexID) => {
          if (indexID !== 0) {
            tableListData += `
            <tr>
              <td>${element.tradingTime[indexID]}</td>
              <td class="uniqueID">${element.uniqueID[indexID]}</td>
              <td>${
                element.position[indexID][0] === "CALL"
                  ? '<span class="up"></span>'
                  : '<span class="down"></span>'
              }
              </td>
              <td>
                <div class="form-check form-switch"><input class="form-check-input switchCheck" type="checkbox" role="switch" ${
                  element.checked[indexID] && "checked"
                } onclick="switchCheck('${
              element.uniqueID[indexID]
            }', this)" ></div>
              </td>
              <td>
                <div class="form-check" >
                  <input class="form-check-input winOrLoss" type="checkbox" ${
                    element.winOrLoss[indexID] && "checked"
                  } onclick="winOrLoss('${element.uniqueID[indexID]}', this)" >
                </div>
              </td>
            </tr>`;
          }
        });
      });

      addTableList.innerHTML = tableListData;
      localStorage.setItem("tableJsonFile", JSON.stringify(tableJsonFile));

      // code editTableJsonFile
      let editTableJsonFile = uniqueCurrency.map((currencyName) => {
        let convertStringToArrSort = convertStringToArr.sort((a, b) => {
          const timeA = a[1];
          const timeB = b[1];
          return timeA.localeCompare(timeB);
        });

        let timeSchedule = convertStringToArrSort
          .map((el, index) => el[0] === currencyName && [...el, index + 1])
          .filter((el) => el !== false);

        let tradingTimeData = timeSchedule.map((timeText) => [
          `${timeText[1]}; &nbsp; ${timeText[2]}`,
        ]);

        let uniqueIDData = timeSchedule.map((id) => [id[3]]);
        let percentageArr = new Array(tradingTimeData.length).fill(0);
        let winOrLossArr = new Array(tradingTimeData.length).fill(false);

        return {
          currencyName: currencyName,
          tradingTime: tradingTimeData,
          uniqueID: uniqueIDData,
          percentage: percentageArr,
          editWinOrLoss: winOrLossArr,
        };
      });

      let editTableListData = "";

      editTableJsonFile.map((element, index) => {
        editTableListData += `
        <tr>
          <th class="timeIdSize" rowspan='${
            element.tradingTime.length
          }' scope="row">#${index + 1}</th>
          <td class="timeIdSize" rowspan='${element.tradingTime.length}'>${
          element.currencyName
        }</td>
          <td class="timeIdSize">${element.tradingTime[0]}</td>
          <td class="timeIdSize" align="center">${element.uniqueID[0]}</td>
          <td>
             <div class="input-group">
                <input type="text" disabled value="${
                  element.percentage[0]
                }" class="form-control text-center" />
                <button class="input-group-text"  onclick="editInputContent('${
                  element.uniqueID[0]
                }', this)">Edit</button>
              </div>
          </td>
          <td>
            <div class="form-check" >
              <input class="form-check-input editWinOrLoss" ${
                element.editWinOrLoss[0] && "checked"
              } type="checkbox" onclick="editWinOrLoss('${
          element.uniqueID[0]
        }', this)">
            </div>
          </td>

        </tr>`;

        element.tradingTime.map((data, indexID) => {
          if (indexID !== 0) {
            editTableListData += `
            <tr>
              <td class="timeIdSize">${element.tradingTime[indexID]}</td>
              <td class="timeIdSize" align="center">${
                element.uniqueID[indexID]
              }</td>
      
              <td>
                <div class="input-group">
                  <input type="text" disabled value="${
                    element.percentage[indexID]
                  }" class="form-control text-center" />
                  <button class="input-group-text" onclick="editInputContent('${
                    element.uniqueID[indexID]
                  }', this)">Edit</button>
                </div>
              </td>
              <td>
                <div class="form-check" >
                  <input class="form-check-input editWinOrLoss" type="checkbox" ${
                    element.editWinOrLoss[indexID] && "checked"
                  } onclick="editWinOrLoss('${
              element.uniqueID[indexID]
            }', this)" >
                </div>
              </td>
            </tr>`;
          }
        });
      });

      editTableList.innerHTML = editTableListData;
      localStorage.setItem(
        "editTableJsonFile",
        JSON.stringify(editTableJsonFile)
      );
    }
  } else {
    // Regular expression to match the pattern
    const regex = /([A-Z]{6});(\d{2}:\d{2});(PUT|CALL)/g;
    // Extract the matches
    const convertStringToArr = [];
    let match;
    while ((match = regex.exec(removedSpace)) !== null) {
      convertStringToArr.push([match[1], match[2], match[3]]);
    }
    if (convertStringToArr.length !== 0) {
      let uniqueCurrency = [
        ...new Set([...convertStringToArr.map((currency) => currency[0])]),
      ];

      let tableJsonFile = uniqueCurrency.map((currencyName) => {
        let convertStringToArrSort = convertStringToArr.sort((a, b) => {
          const timeA = a[1];
          const timeB = b[1];

          // Compare the times
          return timeA.localeCompare(timeB);
        });

        let timeSchedule = convertStringToArrSort
          .map((el, index) => el[0] === currencyName && [...el, index + 1])
          .filter((el) => el !== false);

        let tradingTimeData = timeSchedule.map((timeText) => [
          `${timeText[1]}; &nbsp; ${timeText[2]}`,
        ]);
        let positionData = timeSchedule.map((timeText) => [timeText[2]]);
        let uniqueIDData = timeSchedule.map((id) => [id[3]]);
        let checkedArr = new Array(tradingTimeData.length).fill(false);
        let winOrLossArr = new Array(tradingTimeData.length).fill(false);

        return {
          currencyName: currencyName,
          tradingTime: tradingTimeData,
          uniqueID: uniqueIDData,
          position: positionData,
          checked: checkedArr,
          winOrLoss: winOrLossArr,
        };
      });

      let tableListData = "";
      tableJsonFile.map((element, index) => {
        tableListData += `
        <tr>
          <th rowspan='${element.tradingTime.length}' scope="row">#${
          index + 1
        }</th>
          <td rowspan='${element.tradingTime.length}'>${
          element.currencyName
        }</td>
          <td>${element.tradingTime[0]}</td>
          <td class="uniqueID">${element.uniqueID[0]}</td>
          <td>${
            element.position[0][0] === "CALL"
              ? '<span class="up"></span>'
              : '<span class="down"></span>'
          }</td>
          <td>
            <div class="form-check form-switch"><input class="form-check-input switchCheck" type="checkbox" role="switch" ${
              element.checked[0] && "checked"
            } onclick="switchCheck('${element.uniqueID[0]}', this)" ></div>
          </td>
          <td>
            <div class="form-check" >
              <input class="form-check-input winOrLoss" ${
                element.winOrLoss[0] && "checked"
              } type="checkbox" onclick="winOrLoss('${
          element.uniqueID[0]
        }', this)">
            </div>
          </td>

        </tr>`;

        element.tradingTime.map((data, indexID) => {
          if (indexID !== 0) {
            tableListData += `
            <tr>
              <td>${element.tradingTime[indexID]}</td>
              <td class="uniqueID">${element.uniqueID[indexID]}</td>
              <td>${
                element.position[indexID][0] === "CALL"
                  ? '<span class="up"></span>'
                  : '<span class="down"></span>'
              }
              </td>
              <td>
                <div class="form-check form-switch"><input class="form-check-input switchCheck" type="checkbox" role="switch" ${
                  element.checked[indexID] && "checked"
                } onclick="switchCheck('${
              element.uniqueID[indexID]
            }', this)" ></div>
              </td>
              <td>
                <div class="form-check" >
                  <input class="form-check-input winOrLoss" type="checkbox" ${
                    element.winOrLoss[indexID] && "checked"
                  } onclick="winOrLoss('${element.uniqueID[indexID]}', this)" >
                </div>
              </td>
            </tr>`;
          }
        });
      });

      addTableList.innerHTML = tableListData;
      localStorage.setItem("tableJsonFile", JSON.stringify(tableJsonFile));

      // code editTableJsonFile
      let editTableJsonFile = uniqueCurrency.map((currencyName) => {
        let convertStringToArrSort = convertStringToArr.sort((a, b) => {
          const timeA = a[1];
          const timeB = b[1];
          return timeA.localeCompare(timeB);
        });

        let timeSchedule = convertStringToArrSort
          .map((el, index) => el[0] === currencyName && [...el, index + 1])
          .filter((el) => el !== false);

        let tradingTimeData = timeSchedule.map((timeText) => [
          `${timeText[1]}; &nbsp; ${timeText[2]}`,
        ]);

        let uniqueIDData = timeSchedule.map((id) => [id[3]]);
        let percentageArr = new Array(tradingTimeData.length).fill(0);
        let winOrLossArr = new Array(tradingTimeData.length).fill(false);

        return {
          currencyName: currencyName,
          tradingTime: tradingTimeData,
          uniqueID: uniqueIDData,
          percentage: percentageArr,
          editWinOrLoss: winOrLossArr,
        };
      });

      let editTableListData = "";

      editTableJsonFile.map((element, index) => {
        editTableListData += `
        <tr>
          <th class="timeIdSize" rowspan='${
            element.tradingTime.length
          }' scope="row">#${index + 1}</th>
          <td class="timeIdSize" rowspan='${element.tradingTime.length}'>${
          element.currencyName
        }</td>
          <td class="timeIdSize">${element.tradingTime[0]}</td>
          <td class="timeIdSize" align="center">${element.uniqueID[0]}</td>
          <td>
             <div class="input-group">
                <input type="text" disabled value="${
                  element.percentage[0]
                }" class="form-control text-center" />
                <button class="input-group-text"  onclick="editInputContent('${
                  element.uniqueID[0]
                }', this)">Edit</button>
              </div>
          </td>
          <td>
            <div class="form-check" >
              <input class="form-check-input editWinOrLoss" ${
                element.editWinOrLoss[0] && "checked"
              } type="checkbox" onclick="editWinOrLoss('${
          element.uniqueID[0]
        }', this)">
            </div>
          </td>

        </tr>`;

        element.tradingTime.map((data, indexID) => {
          if (indexID !== 0) {
            editTableListData += `
            <tr>
              <td class="timeIdSize">${element.tradingTime[indexID]}</td>
              <td class="timeIdSize" align="center">${
                element.uniqueID[indexID]
              }</td>
      
              <td>
                <div class="input-group">
                  <input type="text" disabled value="${
                    element.percentage[indexID]
                  }" class="form-control text-center" />
                  <button class="input-group-text" onclick="editInputContent('${
                    element.uniqueID[indexID]
                  }', this)">Edit</button>
                </div>
              </td>
              <td>
                <div class="form-check" >
                  <input class="form-check-input editWinOrLoss" type="checkbox" ${
                    element.editWinOrLoss[indexID] && "checked"
                  } onclick="editWinOrLoss('${
              element.uniqueID[indexID]
            }', this)" >
                </div>
              </td>
            </tr>`;
          }
        });
      });

      editTableList.innerHTML = editTableListData;
      localStorage.setItem(
        "editTableJsonFile",
        JSON.stringify(editTableJsonFile)
      );
    }
  }
});

(() => {
  let tableJsonFile = JSON.parse(localStorage.getItem("tableJsonFile"));
  let editTableJsonFile = JSON.parse(localStorage.getItem("editTableJsonFile"));

  if (tableJsonFile) {
    let tableListData = "";
    tableJsonFile.map((element, index) => {
      tableListData += `
      <tr>
        <th rowspan='${element.tradingTime.length}' scope="row">#${
        index + 1
      }</th>
        <td rowspan='${element.tradingTime.length}'>${element.currencyName}</td>
        <td>${element.tradingTime[0]}</td>
        <td class="uniqueID">${element.uniqueID[0]}</td>
        <td>${
          element.position[0][0] === "CALL"
            ? '<span class="up"></span>'
            : '<span class="down"></span>'
        }</td>
        <td>
          <div class="form-check form-switch"><input class="form-check-input switchCheck" type="checkbox" role="switch" ${
            element.checked[0] && "checked"
          } onclick="switchCheck('${element.uniqueID[0]}', this)" ></div>
        </td>
        <td>
          <div class="form-check" >
            <input class="form-check-input winOrLoss" ${
              element.winOrLoss[0] && "checked"
            } type="checkbox" onclick="winOrLoss('${
        element.uniqueID[0]
      }', this)">
          </div>
        </td>

      </tr>`;

      element.tradingTime.map((data, indexID) => {
        if (indexID !== 0) {
          tableListData += `
          <tr>
            <td>${element.tradingTime[indexID]}</td>
            <td class="uniqueID">${element.uniqueID[indexID]}</td>
            <td>${
              element.position[indexID][0] === "CALL"
                ? '<span class="up"></span>'
                : '<span class="down"></span>'
            }
            </td>
            <td>
              <div class="form-check form-switch"><input class="form-check-input switchCheck" type="checkbox" role="switch" ${
                element.checked[indexID] && "checked"
              } onclick="switchCheck('${
            element.uniqueID[indexID]
          }', this)" ></div>
            </td>
            <td>
              <div class="form-check" >
                <input class="form-check-input winOrLoss" type="checkbox" ${
                  element.winOrLoss[indexID] && "checked"
                } onclick="winOrLoss('${element.uniqueID[indexID]}', this)" >
              </div>
            </td>
          </tr>`;
        }
      });
    });

    addTableList.innerHTML = tableListData;
  }

  if (editTableJsonFile) {
    let editTableListData = "";

    editTableJsonFile.map((element, index) => {
      editTableListData += `
      <tr>
        <th class="timeIdSize" rowspan='${
          element.tradingTime.length
        }' scope="row">#${index + 1}</th>
        <td class="timeIdSize" rowspan='${element.tradingTime.length}'>${
        element.currencyName
      }</td>
        <td class="timeIdSize">${element.tradingTime[0]}</td>
        <td class="timeIdSize" align="center">${element.uniqueID[0]}</td>
        <td>
           <div class="input-group">
              <input type="text" disabled value="${
                element.percentage[0]
              }" class="form-control text-center" />
              <button class="input-group-text"  onclick="editInputContent('${
                element.uniqueID[0]
              }', this)">Edit</button>
            </div>
        </td>
        <td>
          <div class="form-check" >
            <input class="form-check-input editWinOrLoss" ${
              element.editWinOrLoss[0] && "checked"
            } type="checkbox" onclick="editWinOrLoss('${
        element.uniqueID[0]
      }', this)">
          </div>
        </td>

      </tr>`;

      element.tradingTime.map((data, indexID) => {
        if (indexID !== 0) {
          editTableListData += `
          <tr>
            <td class="timeIdSize">${element.tradingTime[indexID]}</td>
            <td class="timeIdSize" align="center">${
              element.uniqueID[indexID]
            }</td>
    
            <td>
              <div class="input-group">
                <input type="text" disabled value="${
                  element.percentage[indexID]
                }" class="form-control text-center" />
                <button class="input-group-text" onclick="editInputContent('${
                  element.uniqueID[indexID]
                }', this)">Edit</button>
              </div>
            </td>
            <td>
              <div class="form-check" >
                <input class="form-check-input editWinOrLoss" type="checkbox" ${
                  element.editWinOrLoss[indexID] && "checked"
                } onclick="editWinOrLoss('${
            element.uniqueID[indexID]
          }', this)" >
              </div>
            </td>
          </tr>`;
        }
      });
    });

    editTableList.innerHTML = editTableListData;
  }
})();

function winOrLoss(id, checkbox) {
  const toast = new bootstrap.Toast(toastLiveExample, {
    delay: 1700,
  });

  let tableJsonFile = JSON.parse(localStorage.getItem("tableJsonFile"));

  if (checkbox.checked) {
    toast.show();
    let latestTableJsonFile = tableJsonFile.map((el) => {
      if (el.uniqueID.find((findId) => findId[0] == id)) {
        let arrIndex = el.uniqueID.flat().findIndex((value) => value == id);
        let updateWinOrLoss = el.winOrLoss;
        updateWinOrLoss[arrIndex] = true;

        return {
          ...el,
          winOrLoss: updateWinOrLoss,
        };
      }
      return el;
    });
    localStorage.setItem("tableJsonFile", JSON.stringify(latestTableJsonFile));
  } else {
    let latestTableJsonFile = tableJsonFile.map((el) => {
      if (el.uniqueID.find((findId) => findId[0] == id)) {
        let arrIndex = el.uniqueID.flat().findIndex((value) => value == id);
        let updateWinOrLoss = el.winOrLoss;
        updateWinOrLoss[arrIndex] = false;

        return {
          ...el,
          winOrLoss: updateWinOrLoss,
        };
      }
      return el;
    });
    localStorage.setItem("tableJsonFile", JSON.stringify(latestTableJsonFile));
  }
}

function editWinOrLoss(id, checkbox) {
  let editTableJsonFile = JSON.parse(localStorage.getItem("editTableJsonFile"));

  if (checkbox.checked) {
    let latestTableJsonFile = editTableJsonFile.map((el) => {
      if (el.uniqueID.find((findId) => findId[0] == id)) {
        let arrIndex = el.uniqueID.flat().findIndex((value) => value == id);
        let updateWinOrLoss = el.editWinOrLoss;
        updateWinOrLoss[arrIndex] = true;

        return {
          ...el,
          editWinOrLoss: updateWinOrLoss,
        };
      }
      return el;
    });
    localStorage.setItem(
      "editTableJsonFile",
      JSON.stringify(latestTableJsonFile)
    );
  } else {
    let latestTableJsonFile = editTableJsonFile.map((el) => {
      if (el.uniqueID.find((findId) => findId[0] == id)) {
        let arrIndex = el.uniqueID.flat().findIndex((value) => value == id);
        let updateWinOrLoss = el.editWinOrLoss;
        updateWinOrLoss[arrIndex] = false;

        return {
          ...el,
          editWinOrLoss: updateWinOrLoss,
        };
      }
      return el;
    });
    localStorage.setItem(
      "editTableJsonFile",
      JSON.stringify(latestTableJsonFile)
    );
  }
}

function editInputContent(id, inputField) {
  let editTableJsonFile = JSON.parse(localStorage.getItem("editTableJsonFile"));

  if (inputField.innerHTML == "Edit") {
    inputField.innerHTML = "Add";
    inputField.previousElementSibling.removeAttribute("disabled");
  } else {
    inputField.previousElementSibling.value =
      inputField.previousElementSibling.value + "%";

    let latestTableJsonFile = editTableJsonFile.map((el) => {
      if (el.uniqueID.find((findId) => findId[0] == id)) {
        let arrIndex = el.uniqueID.flat().findIndex((value) => value == id);
        let updatePercentage = el.percentage;
        updatePercentage[arrIndex] = inputField.previousElementSibling.value;

        return {
          ...el,
          percentage: updatePercentage,
        };
      }
      return el;
    });

    localStorage.setItem(
      "editTableJsonFile",
      JSON.stringify(latestTableJsonFile)
    );

    inputField.innerHTML = "Edit";
    inputField.previousElementSibling.setAttribute("disabled", "disabled");
  }
}

function switchCheck(id, checkbox) {
  let tableJsonFile = JSON.parse(localStorage.getItem("tableJsonFile"));

  if (checkbox.checked) {
    let latestTableJsonFile = tableJsonFile.map((el) => {
      if (el.uniqueID.find((findId) => findId[0] == id)) {
        let arrIndex = el.uniqueID.flat().findIndex((value) => value == id);
        let updateChecked = el.checked;
        updateChecked[arrIndex] = true;

        return {
          ...el,
          checked: updateChecked,
        };
      }
      return el;
    });
    localStorage.setItem("tableJsonFile", JSON.stringify(latestTableJsonFile));
  } else {
    let latestTableJsonFile = tableJsonFile.map((el) => {
      if (el.uniqueID.find((findId) => findId[0] == id)) {
        let arrIndex = el.uniqueID.flat().findIndex((value) => value == id);
        let updateChecked = el.checked;
        updateChecked[arrIndex] = false;

        return {
          ...el,
          checked: updateChecked,
        };
      }
      return el;
    });
    localStorage.setItem("tableJsonFile", JSON.stringify(latestTableJsonFile));
  }
}

// January, February, March, April, May, June, July, August, September, October, November, December
