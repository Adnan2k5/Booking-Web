import { Table } from "antd";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  Mountain,
  Users,
  TrendingUp,
  Compass,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrency = (value = 0) =>
  currencyFormatter.format(Number.isFinite(Number(value)) ? Number(value) : 0);

const defaultDashboardStats = {
  totalRevenue: 0,
  totalUsers: 0,
  activeAdventures: 0,
  totalBookings: 0,
  revenueIncrease: 0,
  userIncrease: 0,
  adventureIncrease: 0,
  bookingIncrease: 0,
  recentBookings: [],
  topAdventures: [],
  monthlyRevenue: [],
};

const bookingColumns = [
  {
    title: "Booking ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "User",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Adventure / Event",
    dataIndex: "adventure",
    key: "adventure",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (value) => formatCurrency(value ?? 0),
  },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const { data, isLoading, error, refresh } = useAdminDashboard(timeRange);

  const stats = data ?? defaultDashboardStats;

  const recentBookingsData = useMemo(
    () => stats.recentBookings.map((booking) => ({ ...booking, key: booking.id })),
    [stats.recentBookings]
  );

  const maxTopAdventureBookings = useMemo(() => {
    if (!stats.topAdventures.length) {
      return 1;
    }
    return stats.topAdventures.reduce(
      (max, adventure) => Math.max(max, adventure.bookings ?? 0),
      1
    );
  }, [stats.topAdventures]);

  const averageBookingValue = useMemo(() => {
    if (!stats.totalBookings) {
      return 0;
    }
    return stats.totalRevenue / stats.totalBookings;
  }, [stats.totalRevenue, stats.totalBookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 hours</SelectItem>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={isLoading}
            title="Refresh dashboard"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center justify-between py-3 text-sm text-destructive">
            <span>Failed to load dashboard data. Please try again.</span>
            <Button size="sm" variant="destructive" onClick={refresh} disabled={isLoading}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span
                className={`flex items-center ${stats.revenueIncrease >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.revenueIncrease >= 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {Math.abs(stats.revenueIncrease ?? 0).toFixed(1)}%
              </span>
              <span>vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span
                className={`flex items-center ${stats.userIncrease >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.userIncrease >= 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {Math.abs(stats.userIncrease ?? 0).toFixed(1)}%
              </span>
              <span>vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Adventures</CardTitle>
            <Mountain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAdventures}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span
                className={`flex items-center ${stats.adventureIncrease >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.adventureIncrease >= 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {Math.abs(stats.adventureIncrease ?? 0).toFixed(1)}%
              </span>
              <span>vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span
                className={`flex items-center ${stats.bookingIncrease >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stats.bookingIncrease >= 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {Math.abs(stats.bookingIncrease ?? 0).toFixed(1)}%
              </span>
              <span>vs last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the last 12 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <RevenueChart
                data={stats.monthlyRevenue}
                isLoading={isLoading && !stats.monthlyRevenue.length}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Adventures</CardTitle>
            <CardDescription>Most popular adventures by bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topAdventures.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not enough adventure data yet.</p>
              ) : (
                stats.topAdventures.map((adventure, index) => (
                  <div key={adventure.id ?? index} className="flex items-center space-x-4">
                    <div className="w-[32px] text-center">
                      <span className="text-xl font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{adventure.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{adventure.bookings.toLocaleString()} bookings</span>
                        <span className="mx-2">•</span>
                        <span>{formatCurrency(adventure.revenue)}</span>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.max(
                              (adventure.bookings / maxTopAdventureBookings) * 100,
                              6
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col">
        <Card className="md:col-span-2 col-span-1">
          <Table
            className="w-full"
            columns={bookingColumns}
            dataSource={recentBookingsData}
            loading={isLoading && !stats.recentBookings.length}
            pagination={false}
          />
        </Card>

        <Card className="col-span-1 md:col-span-1 mt-5">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full p-1 bg-green-100">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Avg. Booking Value</span>
                </div>
                <span className="text-sm font-bold">{formatCurrency(averageBookingValue)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full p-1 bg-purple-100">
                    <Compass className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Top Adventure</span>
                </div>
                <span className="text-sm font-bold">
                  {stats.topAdventures[0]?.name ?? "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RevenueChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading revenue...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No revenue data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <XAxis dataKey="month" stroke="#000000" />
        <YAxis stroke="#000000" />
        <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(label) => label} />
        <Line type="monotone" dataKey="revenue" stroke="#00bfa0" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

