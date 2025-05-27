import { formatMinToLabelTime } from "../../utils/metrics";
import { hexToRgba } from "../../utils/color";
import { Line } from 'react-chartjs-2';
import {verticalLinePlugin} from "../../lib/chartjs/plugin";



const options = {
  responsive: true,
  animation: false,
  plugins: {
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        title: function (tooltipItems) {
          const label = tooltipItems[0].label;
          return formatMinToLabelTime(parseFloat(label));
        },
        label: function (tooltipItem) {
          return `Valeur: ${tooltipItem.formattedValue}`;
        }
      }
    },
    legend: {
      display: false
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 5,
        callback: function (value) {
          const label = this.getLabelForValue(value);
          return formatMinToLabelTime(parseFloat(label));
        }
      }
    },
    y: {
      grid: { display: false }
    }
  }
};

export default function MetricGraph({ labels, values, color }) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        fill: true,
        borderColor: color,
        backgroundColor: hexToRgba(color, 0.2),
        tension: 0.3,
        pointBackgroundColor: color,
        pointRadius: 0,
      },
    ],
  };

  return <Line data={data} options={options} plugins={[verticalLinePlugin]}/>;
}
