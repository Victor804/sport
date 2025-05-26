import Graph from "./Graph";

const color = "#FFA500"

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales:{
    x: {
      grid: {
        display: false
      },
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
       callback: function (value, index, ticks) {
          const firstIndex = 0;
          const lastIndex = ticks.length - 1;
          const middleIndex = Math.floor(lastIndex / 2);
          if (index === firstIndex || index === middleIndex || index === lastIndex) {
            return value;
          }
          return '';
        },
      },
    },
  },
};

export default function WeeklyDistanceGraph({labels, values}){
    return <Graph labels={labels} values={values} color={color} options={options}/>
}