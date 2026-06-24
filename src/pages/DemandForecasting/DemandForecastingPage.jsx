import {
  useEffect,
  useState,
} from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FaDownload,
} from "react-icons/fa";

import {
  getDemandForecastApi,
  exportDemandForecastApi,
} from "../../services/forecastService";

import "./DemandForecastingPage.css";

function DemandForecastingPage() {

  const [
    forecastData,
    setForecastData,
  ] = useState({
    summary: {
      next30DaysForecast: 0,
      averageConfidence: 0,
      productsTracked: 0,
      categories: 0,
    },
    categories: [],
    products: [],
    trendData: [],
    categoryForecast: [],
    topProducts: [],
    forecastDetails: [],
  });

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All Categories");

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState("All Products");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const pieColors = [
    "#0891b2",
    "#db2777",
    "#ea580c",
    "#7c3aed",
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#0ea5e9",
    "#9333ea",
    "#14b8a6",
    "#dc2626",
  ];

  useEffect(() => {
    loadForecastData(
      "All Categories",
      "All Products"
    );
  }, []);

  const loadForecastData = async (
    categoryValue = selectedCategory,
    productValue = selectedProduct
  ) => {

    try {

      setLoading(true);

      const data =
        await getDemandForecastApi(
          categoryValue,
          productValue
        );

      setForecastData(data);

      setError("");

    } catch (error) {

      console.log(error);

      setError(
        "Failed to load demand forecast data"
      );

    } finally {

      setLoading(false);

    }

  };

  const handleCategoryChange = async (event) => {

    const value =
      event.target.value;

    setSelectedCategory(value);

    setSelectedProduct("All Products");

    await loadForecastData(
      value,
      "All Products"
    );

  };

  const handleProductChange = async (event) => {

    const value =
      event.target.value;

    setSelectedProduct(value);

    await loadForecastData(
      selectedCategory,
      value
    );

  };

  const handleExport = () => {

    exportDemandForecastApi(
      selectedCategory,
      selectedProduct
    );

  };

  const formatDateLabel = (dateValue) => {

    const date =
      new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "short",
        day: "numeric",
      }
    );

  };

  const shortText = (text, limit = 16) => {

    if (!text) {
      return "-";
    }

    if (text.length <= limit) {
      return text;
    }

    return `${text.slice(0, limit)}...`;

  };

  if (loading) {

    return (
      <div className="forecast-page">
        <div className="forecast-message">
          Loading demand forecast data...
        </div>
      </div>
    );

  }

  if (error) {

    return (
      <div className="forecast-page">
        <div className="forecast-message error">
          {error}
        </div>
      </div>
    );

  }

  return (

    <div className="forecast-page">

      <div className="forecast-header">

        <div>

          <h1>
            Demand Forecasting
          </h1>

          <p>
            Predict future demand for your products and categories
          </p>

        </div>

        <button
          className="forecast-export-btn"
          onClick={handleExport}
        >
          <FaDownload />
          Export
        </button>

      </div>

      <div className="forecast-filters">

        <div className="forecast-filter-group">

          <label>
            Category
          </label>

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All Categories">
              All Categories
            </option>

            {
              forecastData.categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                )
              )
            }

          </select>

        </div>

        <div className="forecast-filter-group">

          <label>
            Product
          </label>

          <select
            value={selectedProduct}
            onChange={handleProductChange}
          >
            <option value="All Products">
              All Products
            </option>

            {
              forecastData.products.map(
                (product) => (

                  <option
                    key={product}
                    value={product}
                  >
                    {product}
                  </option>

                )
              )
            }

          </select>

        </div>

      </div>

      <div className="forecast-summary-grid">

        <div className="forecast-summary-card">

          <p>
            Next 30 Days Forecast
          </p>

          <h2>
            {forecastData.summary.next30DaysForecast}
          </h2>

          <span className="green-sub-text">
            Total predicted units
          </span>

        </div>

        <div className="forecast-summary-card">

          <p>
            Avg. Confidence
          </p>

          <h2>
            {forecastData.summary.averageConfidence}%
          </h2>

          <span>
            Forecast reliability
          </span>

        </div>

        <div className="forecast-summary-card">

          <p>
            Products Tracked
          </p>

          <h2>
            {forecastData.summary.productsTracked}
          </h2>

          <span>
            Active SKUs
          </span>

        </div>

        <div className="forecast-summary-card">

          <p>
            Categories
          </p>

          <h2>
            {forecastData.summary.categories}
          </h2>

          <span>
            Product categories
          </span>

        </div>

      </div>

      <div className="forecast-chart-grid">

        <div className="forecast-chart-card">

          <h3>
            Demand Trends
          </h3>

          <p className="chart-subtitle">
            Historical vs predicted demand over time
          </p>

          <ResponsiveContainer
            width="100%"
            height={330}
          >
            <LineChart
              data={forecastData.trendData}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#dbeafe"
              />

              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <Tooltip
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value) => [
                  value,
                  "Predicted Demand",
                ]}
              />

              <Line
                type="monotone"
                dataKey="predictedDemand"
                stroke="#10b981"
                strokeWidth={3}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  stroke: "#10b981",
                }}
                activeDot={{
                  r: 6,
                }}
                name="Forecast"
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

        <div className="forecast-chart-card">

          <h3>
            Demand by Category
          </h3>

          <ResponsiveContainer
            width="100%"
            height={330}
          >
            <PieChart>

              <Pie
                data={forecastData.categoryForecast}
                dataKey="predictedDemand"
                nameKey="category"
                cx="50%"
                cy="43%"
                innerRadius={75}
                outerRadius={115}
                paddingAngle={4}
              >

                {
                  forecastData.categoryForecast.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${entry.category}`}
                        fill={pieColors[index % pieColors.length]}
                      />

                    )
                  )
                }

              </Pie>

              <Tooltip
                formatter={(value) => [
                  value,
                  "Predicted Demand",
                ]}
              />

              <Legend
                verticalAlign="bottom"
                height={70}
                iconType="square"
              />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="forecast-bottom-grid">

        <div className="forecast-chart-card">

          <h3>
            Top Products by Forecasted Demand
          </h3>

          <ResponsiveContainer
            width="100%"
            height={330}
          >
            <BarChart
              data={forecastData.topProducts}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#dbeafe"
              />

              <XAxis
                type="number"
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                type="category"
                dataKey="product"
                tickFormatter={(value) => shortText(value, 14)}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
                width={100}
              />

              <Tooltip
                formatter={(value) => [
                  value,
                  "Predicted Demand",
                ]}
              />

              <Bar
                dataKey="predictedDemand"
                fill="#7c3aed"
                radius={[0, 8, 8, 0]}
                barSize={28}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="forecast-table-card">

          <h3>
            Forecast Details
          </h3>

          <div className="forecast-table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Predicted Demand</th>
                  <th>Confidence</th>
                </tr>

              </thead>

              <tbody>

                {
                  forecastData.forecastDetails.map(
                    (item, index) => (

                      <tr key={index}>

                        <td>
                          {item.forecastPeriod}
                        </td>

                        <td>
                          {item.product}
                        </td>

                        <td>
                          {item.category}
                        </td>

                        <td>
                          <strong>
                            {item.predictedDemand}
                          </strong>
                        </td>

                        <td>
                          <span className="confidence-badge">
                            {item.confidence}%
                          </span>
                        </td>

                      </tr>

                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default DemandForecastingPage;