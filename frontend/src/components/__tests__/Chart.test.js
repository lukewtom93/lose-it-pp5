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
