import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- Helper: Transform flexible data into recharts format --- //
function transformData(data: any[]) {
  const yKeys = Array.from(new Set(data.flatMap((d) => d.y.map((p: any) => p.key))));
  const transformed = data.map((d) => {
    const row: any = { name: d.x };
    d.y.forEach((p: any) => {
      row[p.key] = p.count;
    });
    return row;
  });
  return { data: transformed, yKeys };
}

// --- Reusable ChartCard Component --- //
function ChartCard({
  title,
  type,
  data,
  colors,
}: {
  title: string;
  type: "bar" | "line" | "pie";
  data: any[];
  colors: string[];
}) {
  const { data: transformed, yKeys } = transformData(data);

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={transformed} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {yKeys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={colors[i % colors.length]} stackId="stack" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={transformed}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {yKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        const pieValues = yKeys.map((key, i) => ({
          name: key,
          value: transformed.reduce((acc, d) => acc + (d[key] ?? 0), 0),
          fill: colors[i % colors.length],
        }));
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Tooltip />
              <Pie data={pieValues} dataKey="value" nameKey="name" outerRadius={120} label>
                {pieValues.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {renderChart()}
    </div>
  );
}

// --- Main Page --- //
export default function DataPage() {
  const [chartData, setChartData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const colorSets = [
    ["#E24E1B", "#134340", "#F2A900", "#5A189A", "#3A86FF", "#2A9D8F", "#D00000", "#FFB5A7", "#8338EC", "#8D99AE"],
    ["#9B2226", "#134340", "#F2A900", "#005F73", "#0A9396", "#BB3E03", "#94D2BD", "#EE9B00", "#CA6702", "#E9D8A6"],
  ];

  useEffect(() => {
    fetch("http://localhost:8000/charts")
      .then((res) => res.json())
      .then((data) => {
        setChartData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load chart data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading charts...</div>;
  }

  // Dynamically create chart configs
  const chartConfigs: {
    id: string;
    title: string;
    type: "bar";
    data: any[];
    colors: string[];
  }[] = [];

  Object.entries(chartData).forEach(([category, groupings], catIndex) => {
    Object.entries(groupings).forEach(([groupBy, data]) => {
      const title = `Article ${category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} ${
        groupBy === "by_model" ? "by Model" : "by Publication"
      }`;
      chartConfigs.push({
        id: `${category}-${groupBy}`,
        title,
        type: "bar",
        data: data || [],
        colors: colorSets[catIndex % colorSets.length],
      });
    });
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Data</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chartConfigs.map((chart) => (
          <ChartCard
            key={chart.id}
            title={chart.title}
            type={chart.type}
            data={chart.data}
            colors={chart.colors}
          />
        ))}
      </div>
    </div>
  );
}
