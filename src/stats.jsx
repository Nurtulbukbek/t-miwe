import React, { useState, useEffect } from "react";
import "./App.css";

function Stats() {
  const [data, setData] = useState([]);
  const [totalHarvest, setTotalHarvest] = useState(0);
  const [illTrees, setIllTrees] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periodType, setPeriodType] = useState("Неделя");

  // Запрос к API
  useEffect(() => {
    fetch("http://10.20.110.29:8000/api/reports/")
      .then((response) => response.json())
      .then((result) => {
        setData(result);

        // Подсчитываем суммарный урожай
        const totalHarvestWeight = result.reduce((sum, item) => {
          return sum + parseFloat(item.harvest_weight);
        }, 0);

        // Подсчитываем количество больных деревьев
        const totalIllTrees = result.reduce((sum, item) => {
          return sum + item.ill_tree_count;
        }, 0);

        // Устанавливаем начальную и конечную даты
        const start = result.length > 0 ? result[0].created_at.split("T")[0] : "";
        const end =
          result.length > 0
            ? result[result.length - 1].created_at.split("T")[0]
            : "";

        setTotalHarvest(totalHarvestWeight);
        setIllTrees(totalIllTrees);
        setStartDate(start);
        setEndDate(end);
      })
      .catch((error) => console.error("Ошибка при загрузке данных:", error));
  }, []);

  return (
    <div className="container">
      <div className="headPart">
        <h1>СТАТИСТИКА</h1>
      </div>

      <div className={`info`}>
        <div className={`infoItem`}>
          <img src="/treeIcon.png" alt="Tree Icon" />
          <h2>Урожай: {totalHarvest}kg</h2>
        </div>
        <div className={`infoItem`}>
          <h2>Тип периода</h2>
          <h3>{periodType}</h3>
        </div>
        <div className={`infoItem`}>
          <h2>Дата начала</h2>
          <h3>{startDate}</h3>
        </div>
        <div className={`infoItem`}>
          <h2>Дата окончания</h2>
          <h3>{endDate}</h3>
        </div>
        <div className={`infoItem`}>
          <h2>Количество полей</h2>
          <h3>{data.length}</h3>
        </div>
      </div>

      <div className="stats">
        <div className="weekHarvest statsItem">
          <h2 className="statsItemText">Урожай за мес</h2>
          <h2 className="statsCount">{(totalHarvest / 4).toFixed(2)}kg</h2>
        </div>
        <div className="monthHarvest statsItem">
          <h2 className="statsItemText">Урожай за нед</h2>
          <h2 className="statsCount">{(totalHarvest / 7).toFixed(2)}kg</h2>
        </div>
        <div className="yearHarvest statsItem">
          <h2 className="statsItemText">Урожай за год</h2>
          <h2 className="statsCount">{totalHarvest}kg</h2>
        </div>
        <div className="illTrees statsItem">
          <h2 className="statsItemText">Больные деревья</h2>
          <h2 className="statsCount">{illTrees}</h2>
        </div>
      </div>
    </div>
  );
}

export default Stats;