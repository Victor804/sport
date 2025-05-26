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

import {hexToRgba} from "../../utils/color";


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


export default function Graph({labels, values, color, options}) {
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
