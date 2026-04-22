import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";



const Chart =  ({data}) => {
  const chartData = data.map((entry) => ({


    date: entry.date,
    current_weight: Number(entry.current_weight),
    target_weight: Number(entry.target_weight),
  }))

  return (
    <div style={{ width: "100%", height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="5 5"/>
            <Tooltip/>
            <Legend/>
        <Line type="monotone" dataKey="current_weight" />
        <Line type="monotone" dataKey="target_weight" />
        </LineChart>
    </ResponsiveContainer>
    </div>
  );
}

export default Chart;