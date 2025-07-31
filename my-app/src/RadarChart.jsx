import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function normalize(value, min, max) {
  if (value == null || isNaN(value)) return 0;
  return (value - min) / (max - min);
}


const maxValues = {
  poverty: 60,
  gni: 9000,
  NEET: 60,
  unemployment: 20,
  healthcoverage: 65,
};

const minValues = {
  poverty: 0,
  gni: 2000,
  NEET: 0,
  unemployment: 0,
  healthcoverage: 30,
};
export function RadarChartComponent({ country }) {
  if (!country) 
    return null;
  const rawValues = {
    "Poverty Rate (%)": country.poverty,
    "GNI per capita ($)": country.gni,
    "NEET Youth (%)": country.NEET,
    "Unemployment Rate (%)": country.unemployment,
    "Essential Health Services Coverage (%)": country.healthcoverage,
  };

  const indicators = [
    {
      indicator: "Poverty Rate (%)",
      value: normalize(country.poverty, minValues.poverty, maxValues.poverty),
    },
    {
      indicator: "GNI per capita ($)",
      value: normalize(country.gni, minValues.gni, maxValues.gni),
    },
    {
      indicator: "NEET Youth (%)",
      value: normalize(country.NEET, minValues.NEET, maxValues.NEET),
    },
    {
      indicator: "Unemployment Rate (%)",
      value: normalize(country.unemployment, minValues.unemployment, maxValues.unemployment),
    },
    {
      indicator: "Essential Health Services Coverage (%)",
      value: normalize(country.healthcoverage, minValues.healthcoverage, maxValues.healthcoverage),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart outerRadius="80%" data={indicators}>
        <PolarGrid />
        <PolarAngleAxis dataKey="indicator" />
        <PolarRadiusAxis />
        <Tooltip
          contentStyle={{
            borderRadius: 6,
            width: 250,
            height: 40,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            fontSize: "0.875rem",
          }}
          formatter={(value, name, props) => {
            const raw = rawValues[props.payload.indicator];
            return [`${raw}`];
          }}
        />
        <Radar
          name={country.name}
          dataKey="value"
          stroke="#9d174d"
          fill="#9d174d7c"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}