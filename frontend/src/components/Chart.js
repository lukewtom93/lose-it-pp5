import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Chart = ({ data }) => {
  // Normalizes the incoming data into the exact keys the chart needs
  const chartData = data.map((entry) => ({
    date: entry.date,
    current_weight: Number(entry.current_weight),
    target_weight: Number(entry.target_weight),
  }));

  const CustomLegend = () => (
    <div className="d-flex justify-content-center gap-4 mt-3">
      <span>
        <svg width="30" height="10">
          <line
            x1="0"
            y1="5"
            x2="30"
            y2="5"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        Current Weight
      </span>

      <span>
        <svg width="30" height="10">
          <line
            x1="0"
            y1="5"
            x2="30"
            y2="5"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </svg>
        Target Weight
      </span>
    </div>
  );

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })
            }
          />
          <YAxis />
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip
            labelFormatter={(value) =>
              new Date(value).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "long",
              })
            }
          />
          <Legend content={<CustomLegend/>}/>
          <Line type="monotone" dataKey="current_weight" strokeWidth={3} />
          <Line type="monotone" dataKey="target_weight" strokeDasharray="6 4"/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
