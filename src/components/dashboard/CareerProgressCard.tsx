import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JobApplication } from '@/types/jobApplications';

interface CareerProgressCardProps {
  courseProgress: number;
  applications?: JobApplication[];
}

const WEEKLY_TARGET = 30;
const MAX_WEEKS = 12;
const WEEKS_PER_PAGE = 4;

/* ---------- Date helpers ---------- */

function toValidDate(value: unknown): Date | null {
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

function getISOWeekLabel(weekStart: Date) {
  const d = new Date(Date.UTC(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate()
  ));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const year = d.getUTCFullYear();
  const currentYear = new Date().getFullYear();
  return year !== currentYear ? `W${week} ${year}` : `W${week}`;
}

/* ---------- Buckets ---------- */

type WeekBucket = { start: Date; key: string };

function buildWeekBuckets(applications: JobApplication[]) {
  if (!applications.length) return { weeks: [], counts: [] };

  const dates = applications
    .map(a => toValidDate(a.date_applied))
    .filter(Boolean) as Date[];

  if (!dates.length) return { weeks: [], counts: [] };

  const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
  const firstMonday = startOfWeekMonday(earliest);

  const weeks: WeekBucket[] = [];
  const cursor = new Date(firstMonday);
  const today = new Date();

  while (cursor <= today && weeks.length < MAX_WEEKS) {
    weeks.push({ start: new Date(cursor), key: String(cursor.getTime()) });
    cursor.setDate(cursor.getDate() + 7);
  }

  const counts = new Array(weeks.length).fill(0);

  for (const app of applications) {
    const d = toValidDate(app.date_applied);
    if (!d) continue;

    const weekStart = startOfWeekMonday(d);
    const idx = Math.floor(
      (weekStart.getTime() - weeks[0].start.getTime()) / (7 * 86400000)
    );

    if (idx >= 0 && idx < counts.length) counts[idx]++;
  }

  return { weeks, counts };
}

/* ---------- Component ---------- */

const CareerProgressCard = ({
  courseProgress,
  applications = [],
}: CareerProgressCardProps) => {
  const { weeks, counts } = useMemo(
    () => buildWeekBuckets(applications),
    [applications]
  );

  // Pagination state - start with the latest 4 weeks
  const totalWeeks = weeks.length;
  const totalPages = Math.ceil(totalWeeks / WEEKS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(totalPages - 1); // Start at last page (latest weeks)

  // Get current page data
  const startIdx = currentPage * WEEKS_PER_PAGE;
  const endIdx = Math.min(startIdx + WEEKS_PER_PAGE, totalWeeks);
  const displayedWeeks = weeks.slice(startIdx, endIdx);
  const displayedCounts = counts.slice(startIdx, endIdx);

  const maxCount = displayedCounts.length ? Math.max(...displayedCounts) : 0;
  const chartMax = Math.max(maxCount, WEEKLY_TARGET, 1);
  const targetPercent = (WEEKLY_TARGET / chartMax) * 100;
  const yTicks = [chartMax, Math.round(chartMax / 2), 0];

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Applications Progress</h3>
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 inline-block" />
            Working
          </Badge>
        </div>

        {/* Navigation Controls */}
        {totalWeeks > WEEKS_PER_PAGE && (
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={!canGoPrevious}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs text-gray-500">
              Showing weeks {startIdx + 1}-{endIdx} of {totalWeeks}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!canGoNext}
              className="h-8"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Chart */}
        <div className="mt-10 relative">
          <div className="absolute left-0 -top-4 text-[10px] text-gray-500">
            Applications
          </div>

          <div className="grid grid-cols-[32px_1fr] gap-3 h-52">
            {/* Y axis */}
            <div className="flex flex-col justify-between text-[10px] text-gray-500 pb-14">
              {yTicks.map(v => (
                <span key={v}>{v}</span>
              ))}
            </div>

            {/* Plot area */}
            <div className="relative h-full pr-8">
              {/* Target line */}
              <div
                className="absolute left-0 right-0 z-0"
                style={{ top: `${100 - targetPercent}%` }}
              >
                <div className="relative border-t border-dashed border-gray-300">
                  <span className="absolute right-0 top-0 -translate-y-1/2 translate-x-2 bg-background px-1 text-[10px] text-gray-500 whitespace-nowrap">
                    Target: {WEEKLY_TARGET}
                  </span>
                </div>
              </div>

              {/* Bars */}
              <div className="flex items-end justify-center gap-4 h-full pb-14 relative z-10">
                {displayedCounts.map((count, i) => {
                  const height = (count / chartMax) * 100;

                  return (
                    <div key={displayedWeeks[i]?.key ?? i} className="w-8 flex justify-center">
                      <div className="relative w-6 h-32 bg-gray-100 rounded-full">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-full transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X axis */}
              <div className="absolute left-0 right-0 bottom-14 h-px bg-gray-300" />

              {/* Week labels BELOW x-axis */}
              <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-4">
                {displayedWeeks.map((w) => (
                  <div
                    key={w.key}
                    className="w-8 text-[10px] text-gray-600 text-center font-medium"
                  >
                    {getISOWeekLabel(w.start)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 text-center mt-2">
            Weeks
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerProgressCard;
