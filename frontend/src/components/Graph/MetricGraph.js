import { formatMinToLabelTime } from "../../utils/metrics";
import { hexToRgba } from "../../utils/color";
import { Line } from 'react-chartjs-2';
import {verticalLinePlugin} from "../../lib/chartjs/plugin";



export default function MetricGraph({ labels, values, values2, values3 }) {
  const data = {
      labels: labels,
      datasets: [
          {
            data: values,
            fill: true,
            borderColor: "#1d91f5",
            backgroundColor: hexToRgba("#1d91f5", 0.3),
            tension: 0.3,
            pointRadius: 0,
            yAxisID: 'y2'
          },
          {
            data: values2,
            fill: true,
            borderColor: "#f51d1d",
            backgroundColor: hexToRgba("#f51d1d", 0.3),
            tension: 0.3,
            pointRadius: 0,
            yAxisID: 'y1',
          },
          {
            data: values3,
            fill: true,
            borderColor: "#8e8686",
            backgroundColor: hexToRgba("#8e8686", 0.3),
            tension: 0.3,
            pointRadius: 0,
          },
      ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        position: 'customTop',
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
    scales:{
      x: {
        grid: {display: false},
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
        stack: 'stack',
        title: {
          display: true,
          text: "Altitude"
        },
        stackWeight: 1
      },
      y1: {
        stack: 'stack',
        title: {
          display: true,
          text: "Heart rate"
        },
        stackWeight: 1,
        offset: true
      },
      y2: {
        stack: 'stack',
        title: {
          display: true,
          text: "Speed"
        },
        stackWeight: 1,
        offset: true
      }
    }
  };

  return <Line data={data} options={options} plugins={[verticalLinePlugin]}/>;
}
