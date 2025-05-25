import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import {hexToRgba} from "../utils/color";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


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

export default function Graph({labels, values, color}) {
  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        fill: true,
        borderColor: color,
        backgroundColor: hexToRgba(color, 0.2),
        tension: 0.3,
        pointBackgroundColor: color,
      },
    ],
  };

  return <Line data={data} options={options} />;
}
