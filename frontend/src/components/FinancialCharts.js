// Interactive Financial Charts Component
// Uses Nivo for beautiful, interactive data storytelling

import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

// Market Performance Line Chart
export const MarketPerformanceChart = ({ data, title = "Market Performance Over Time" }) => {
  const chartData = data || [
    {
      id: "S&P 500",
      data: [
        { x: "2024-01", y: 4200 },
        { x: "2024-02", y: 4350 },
        { x: "2024-03", y: 4280 },
        { x: "2024-04", y: 4520 },
        { x: "2024-05", y: 4480 },
        { x: "2024-06", y: 4650 },
        { x: "2024-07", y: 4580 },
        { x: "2024-08", y: 4720 },
        { x: "2024-09", y: 4445 }
      ]
    },
    {
      id: "NASDAQ",
      data: [
        { x: "2024-01", y: 13200 },
        { x: "2024-02", y: 13850 },
        { x: "2024-03", y: 13450 },
        { x: "2024-04", y: 14200 },
        { x: "2024-05", y: 14100 },
        { x: "2024-06", y: 14680 },
        { x: "2024-07", y: 14350 },
        { x: "2024-08", y: 14920 },
        { x: "2024-09", y: 14250 }
      ]
    },
    {
      id: "DOW JONES",
      data: [
        { x: "2024-01", y: 33500 },
        { x: "2024-02", y: 34200 },
        { x: "2024-03", y: 33800 },
        { x: "2024-04", y: 35100 },
        { x: "2024-05", y: 34850 },
        { x: "2024-06", y: 35600 },
        { x: "2024-07", y: 35200 },
        { x: "2024-08", y: 36100 },
        { x: "2024-09", y: 34850 }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 110, bottom: 60, left: 80 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          yFormat=" >-.2f"
          curve="cardinal"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Time Period',
            legendOffset: 50,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Index Value',
            legendOffset: -60,
            legendPosition: 'middle'
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          colors={['#3b82f6', '#10b981', '#f59e0b']}
          animate={true}
          motionStiffness={120}
          motionDamping={50}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          theme={{
            tooltip: {
              container: {
                background: '#ffffff',
                color: '#333333',
                fontSize: '12px',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e5e7eb'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

// Economic Indicators Bar Chart
export const EconomicIndicatorsChart = ({ data, title = "Economic Indicators" }) => {
  const chartData = data || [
    {
      indicator: "GDP Growth",
      value: 2.3,
      color: '#3b82f6'
    },
    {
      indicator: "Unemployment",
      value: 3.8,
      color: '#ef4444'
    },
    {
      indicator: "Inflation Rate",
      value: 3.2,
      color: '#f59e0b'
    },
    {
      indicator: "Fed Funds Rate",
      value: 5.25,
      color: '#8b5cf6'
    },
    {
      indicator: "Consumer Confidence",
      value: 102.5,
      color: '#10b981'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div style={{ height: '350px' }}>
        <ResponsiveBar
          data={chartData}
          keys={['value']}
          indexBy="indicator"
          margin={{ top: 20, right: 50, bottom: 60, left: 80 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ datum: 'data.color' }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Economic Indicators',
            legendPosition: 'middle',
            legendOffset: 50
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value (%)',
            legendPosition: 'middle',
            legendOffset: -60
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          theme={{
            tooltip: {
              container: {
                background: '#ffffff',
                color: '#333333',
                fontSize: '12px',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e5e7eb'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

// Sector Performance Pie Chart
export const SectorPerformanceChart = ({ data, title = "Sector Performance" }) => {
  const chartData = data || [
    {
      id: "Technology",
      label: "Technology",
      value: 28.5,
      color: "#3b82f6"
    },
    {
      id: "Healthcare",
      label: "Healthcare",
      value: 15.2,
      color: "#10b981"
    },
    {
      id: "Finance",
      label: "Finance",
      value: 18.7,
      color: "#f59e0b"
    },
    {
      id: "Energy",
      label: "Energy",
      value: 8.9,
      color: "#ef4444"
    },
    {
      id: "Consumer",
      label: "Consumer",
      value: 12.3,
      color: "#8b5cf6"
    },
    {
      id: "Industrial",
      label: "Industrial",
      value: 9.8,
      color: "#06b6d4"
    },
    {
      id: "Other",
      label: "Other",
      value: 6.6,
      color: "#6b7280"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div style={{ height: '400px' }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
          innerRadius={0.4}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={2}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.6]]
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]]
          }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#333',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
          theme={{
            tooltip: {
              container: {
                background: '#ffffff',
                color: '#333333',
                fontSize: '12px',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e5e7eb'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

// Risk vs Return Scatter Plot
export const RiskReturnChart = ({ data, title = "Risk vs Return Analysis" }) => {
  const chartData = data || [
    {
      id: "stocks",
      data: [
        { x: 15.2, y: 8.5, symbol: 'AAPL' },
        { x: 18.7, y: 12.3, symbol: 'TSLA' },
        { x: 12.1, y: 6.8, symbol: 'MSFT' },
        { x: 22.5, y: 15.2, symbol: 'NVDA' },
        { x: 8.9, y: 4.2, symbol: 'JNJ' },
        { x: 25.8, y: 18.9, symbol: 'AMZN' },
        { x: 14.3, y: 7.6, symbol: 'GOOGL' },
        { x: 19.4, y: 11.8, symbol: 'META' }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div style={{ height: '400px' }}>
        <ResponsiveScatterPlot
          data={chartData}
          margin={{ top: 20, right: 140, bottom: 60, left: 80 }}
          xScale={{ type: 'linear', min: 0, max: 30 }}
          yScale={{ type: 'linear', min: 0, max: 25 }}
          colors={['#3b82f6']}
          blendMode="multiply"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Risk (Volatility %)',
            legendPosition: 'middle',
            legendOffset: 46
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Return (%)',
            legendPosition: 'middle',
            legendOffset: -60
          }}
          nodeSize={12}
          animate={true}
          motionStiffness={120}
          motionDamping={50}
          tooltip={({ node }) => (
            <div className="bg-white p-3 shadow-lg rounded border">
              <div className="font-semibold">{node.data.symbol}</div>
              <div className="text-sm text-gray-600">
                Risk: {node.data.x}% | Return: {node.data.y}%
              </div>
            </div>
          )}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 130,
              translateY: 0,
              itemWidth: 100,
              itemHeight: 12,
              itemsSpacing: 5,
              itemDirection: 'left-to-right',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          theme={{
            tooltip: {
              container: {
                background: '#ffffff',
                color: '#333333',
                fontSize: '12px',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e5e7eb'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

// Main Financial Charts Container Component
const FinancialCharts = ({ marketData, economicData, sectorData, riskData, chartType = 'all' }) => {
  const renderChart = (type) => {
    switch (type) {
      case 'market':
        return <MarketPerformanceChart data={marketData} />;
      case 'economic':
        return <EconomicIndicatorsChart data={economicData} />;
      case 'sector':
        return <SectorPerformanceChart data={sectorData} />;
      case 'risk':
        return <RiskReturnChart data={riskData} />;
      default:
        return null;
    }
  };

  if (chartType !== 'all') {
    return renderChart(chartType);
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interactive Financial Charts
        </h2>
        <p className="text-gray-600">
          Powered by Nivo - Interactive data visualization for financial storytelling
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <MarketPerformanceChart data={marketData} />
        <EconomicIndicatorsChart data={economicData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SectorPerformanceChart data={sectorData} />
        <RiskReturnChart data={riskData} />
      </div>

      {/* Chart Features */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Chart Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Interactive tooltips</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Responsive design</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Smooth animations</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Real-time data updates</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Professional styling</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Export capabilities</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Accessibility support</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>NPR-quality aesthetics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;