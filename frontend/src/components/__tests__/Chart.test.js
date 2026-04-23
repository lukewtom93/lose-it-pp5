import { render, screen } from "@testing-library/react";
import Chart from "../Chart";

// Mock Recharts so tests focus on our component logic,
// not on SVG/chart rendering internals.
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),

  LineChart: ({ children, data }) => (
    <div data-testid="line-chart" data-chart={JSON.stringify(data)}>
      {children}
    </div>
  ),

  Line: ({ dataKey }) => <div>{dataKey}</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: ({ content }) => <div>{content}</div>,
}));

test("renders chart container", () => {
  render(<Chart data={[]} />);

  expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  expect(screen.getByTestId("line-chart")).toBeInTheDocument();
});

test("renders custom legend labels", () => {
  render(<Chart data={[]} />);

  expect(screen.getByText("Current Weight")).toBeInTheDocument();
  expect(screen.getByText("Target Weight")).toBeInTheDocument();
});

test("normalizes chart data before rendering", () => {
  const data = [
    {
      date: "2026-04-01",
      current_weight: "90.50",
      target_weight: "88.00",
    },
  ];

  render(<Chart data={data} />);

  const chart = screen.getByTestId("line-chart");
  const passedData = JSON.parse(chart.getAttribute("data-chart"));

  expect(passedData).toEqual([
    {
      date: "2026-04-01",
      current_weight: 90.5,
      target_weight: 88,
    },
  ]);
});

test("handles empty data", () => {
  render(<Chart data={[]} />);

  const chart = screen.getByTestId("line-chart");
  const passedData = JSON.parse(chart.getAttribute("data-chart"));

  expect(passedData).toEqual([]);
});
