import autoAnimate from "https://cdn.jsdelivr.net/npm/@formkit/auto-animate@1.0.0-beta.1/index.min.js";

class List {
  data;
  yearObject;
  listDom;
  startYear = 1960;
  endYear = 2020; //2020 1965
  timer = 1000;
  animationDuration = 1000;
  valueAnimationDuration = 1000;

  constructor(data) {
    this.data = data;
    this.createListContainer();
    this.startTimer(this.timer);
  }

  calculatePercentage(initialNumber, compareNumber) {
    const res = Math.ceil((compareNumber / initialNumber) * 100);
    return res > 100 ? 100 : res;
  }

  createListContainer() {
    this.title = document.getElementById("title");
    this.listDom = document.createElement("ul");
    document.body.appendChild(this.listDom);
  }

  startTimer(miliseconds) {
    const myInterval = setInterval(() => {
      try {
        this.render([`${this.startYear}`]);
        autoAnimate(this.listDom, { duration: this.animationDuration });
        this.startYear = this.startYear + 1;
        if (this.startYear === this.endYear) {
          clearInterval(myInterval);
        }
      } catch (err) {
        clearInterval(myInterval);
        console.error(err);
      }
    }, miliseconds);
  }

  animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  getLiContent(dataObj) {
    const firstValueOfTheList = parseInt(this.listDom?.firstChild?.children[1]?.children[1]?.innerText) || dataObj?.population;
    const width = this.calculatePercentage(firstValueOfTheList, dataObj.population);
    return `<div id="${dataObj.countryName}-bar" class="bar" style="width: ${width}%;"></div>
            <div class="content-container">
              <div class="first-row">
                <div flag="${dataObj.flag}" class="li-icon"></div>
                <div>${dataObj.countryName}
                <div class="bar-text">Actual: ${width}% ${(width < 100 ? "Difference: -" + (100 - width) + "%" : '')}</div></div>
              </div>
              <div id="${dataObj.countryName}-value">${dataObj.population}</div>
            </div>`;
  }

  render(itemKeyList) {
    let prevItem;
    itemKeyList.forEach((year) => {
      this.title.innerText = `Year ${year}`;
      this.data[year].forEach((dataObj) => {
        
        let li = document.getElementById(`${dataObj.countryName}`);
        if (!li) {
          li = document.createElement("li");
          li.innerHTML = this.getLiContent(dataObj);
          li.setAttribute("id", `${dataObj.countryName}`);
          this.listDom.appendChild(li);
        } else {
          const startValue = parseInt(document.getElementById(`${dataObj.countryName}-value`).innerText);
          li.innerHTML = this.getLiContent(dataObj);
          const obj = document.getElementById(`${dataObj.countryName}-value`);
          this.animateValue(obj, startValue, parseInt(dataObj.population), this.valueAnimationDuration); // document.getElementById(`${dataObj.countryName}-value`).innerText
          if (prevItem) {
            prevItem.after(li);
          } else {
            this.listDom.prepend(li);
          }
        }
        prevItem = li;
      });
    });
  }
}

fetch("/index/dummyData")
  .then((response) => response.json())
  .then((data) => {
    new List(data);
  })
  .catch((error) => console.error(error));
