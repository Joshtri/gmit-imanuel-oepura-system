import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function StatPieChart({ 
  title = "Statistik Jenis Kelamin", 
  data = [{ name: "Pria", value: 400 }, { name: "Wanita", value: 300 }],
  size = "normal" // "small", "normal", "large"
}) {
  // Dynamic sizing based on size prop
  const getSizing = () => {
    switch(size) {
      case "small":
        return {
          titleClass: "text-sm font-medium mb-2",
          outerRadius: 50,
          legendHeight: 24,
          fontSize: "10"
        };
      case "large":
        return {
          titleClass: "text-xl font-medium mb-6",
          outerRadius: 100,
          legendHeight: 48,
          fontSize: "14"
        };
      default: // normal
        return {
          titleClass: "text-base font-medium mb-3",
          outerRadius: 65,
          legendHeight: 32,
          fontSize: "12"
        };
    }
  };

  const sizing = getSizing();

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className={`text-center ${sizing.titleClass}`}>{title}</h2>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={sizing.outerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={sizing.legendHeight}
            wrapperStyle={{ 
              paddingTop: '10px',
              fontSize: sizing.fontSize
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
