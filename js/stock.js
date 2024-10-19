function updateClockBangladesh() {
  const options = {
    timeZone: "Asia/Dhaka",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formattedTime = new Date().toLocaleTimeString("en-US", options);
  // Update the clock element
  document.getElementById("clock").textContent = formattedTime;
}

// Update the clock immediately and then every second
updateClockBangladesh();
setInterval(updateClockBangladesh, 1000);

let currencyReportList = document.getElementById("currencyReportList");
let currencyReportBtn = document.getElementById("currencyReportBtn");
let resetText = document.getElementById("reset");

resetText.addEventListener("click", () => {
  let stockInfo = document.getElementById("stockInfo");
  stockInfo.value = "";
});

currencyReportBtn.addEventListener("click", () => {
  // currencyReportList.innerHTML = "sdf"

  let stockInfo = document.getElementById("stockInfo");
  let removedSpace = stockInfo.value.replace(/\s+/g, "");

  if (removedSpace.split(";")[0].match(/OTC/gi)) {
    const modifiedStr = removedSpace.replace(/([A-Z]{6}-OTC)/g, ",$1");
    const segments = modifiedStr.split(",").filter(Boolean);

    const convertStringToArr = segments.map((segment) => segment.split(";"));
    if (convertStringToArr.length !== 0) {
      let tableListData = "";
      convertStringToArr.map((element, index) => {
        tableListData += `
            <span class="list-group-item semiboldText list-group-item-action pt-3 pb-3">${element[0]} &nbsp; &nbsp; &nbsp; ${element[1]} &nbsp; &nbsp; &nbsp; ${element[2]}</span>
        `;
        currencyReportList.innerHTML = tableListData;
      });
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
      let tableListData = "";
      convertStringToArr.map((element, index) => {
        tableListData += `
            <span class="list-group-item semiboldText list-group-item-action pt-3 pb-3">${element[0]} &nbsp; &nbsp; &nbsp; ${element[1]} &nbsp; &nbsp; &nbsp; ${element[2]}</span>
        `;
        currencyReportList.innerHTML = tableListData;
      });
    }
  }
});
