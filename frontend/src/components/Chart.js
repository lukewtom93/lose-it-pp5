import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";


function Chart({data}) {
  const chartData = data.map((entry) => ({

    date: entry.created_at,
    current_weight: Number(entry.current_weight),
  }))

  return (
    <div style={{ width: "100%", height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
            <XAxis/>
            <YAxis/>
        <Line dataKey="current_weight" />
        </LineChart>
    </ResponsiveContainer>
    </div>
  );
}

export default Chart;
