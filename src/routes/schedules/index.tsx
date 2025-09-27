import { ScheduleList } from "@/pages/ScheduleList/ScheduleList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedules/")({
  component: ScheduleList,
});