/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { useScheduleStore } from "@/store/scheduleStore"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar/Navbar"
import { useAuthGuard } from "@/hooks/authGuard"
import { useApi } from "@/lib/api"
import { SchedulePopup } from "@/components/SchedulesPopup/SchedulesPopup"
import { ConfirmDeletePopup } from "@/components/SchedulesPopup/DeletePopUp"

import { Clock, Pencil, Trash, Plus } from "lucide-react"

export function ScheduleList() {
  useAuthGuard()
  const { trains, deleteTrain } = useScheduleStore()
  const [search, setSearch] = useState("")
  const { getSchedules, deleteSchedule } = useApi()

  const [popupOpen, setPopupOpen] = useState(false)
  const [popupMode, setPopupMode] = useState<"create" | "edit">("create")
  const [selectedTrain, setSelectedTrain] = useState<any>(null)

  const [deletePopupOpen, setDeletePopupOpen] = useState(false)

  const filteredTrains = trains.filter(
    (t) =>
      (t.trainNumber?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (t.departureStation?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (t.arrivalStation?.toLowerCase() ?? "").includes(search.toLowerCase())
  )

  const handleDeleteSchedule = async (id: number) => {
    try {
      await deleteSchedule(id)
      deleteTrain(id)
    } catch (error) {
      console.error("Failed to delete schedule:", error)
    }
  }

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await getSchedules()
        useScheduleStore.getState().setTrains(response.data)
      } catch (error) {
        console.error("Failed to fetch schedules:", error)
      }
    }
    fetchSchedules()
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-50">
        <Card className="max-w-5xl mx-auto shadow-md border border-gray-200">
          <CardHeader className="flex justify-between items-center flex-row">
            <CardTitle className="text-2xl font-bold">Train Schedule</CardTitle>
            <Button
              onClick={() => {
                setPopupMode("create")
                setSelectedTrain(null)
                setPopupOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Train
            </Button>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by train number or station..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Train №</th>
                    <th className="p-3 text-left">Departure Station</th>
                    <th className="p-3 text-left">Arrival Station</th>
                    <th className="p-3 text-left">Times</th>
                    <th className="p-3 text-left">Platform</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrains.length > 0 ? (
                    filteredTrains.map((train) => (
                      <tr key={train.id} className="border-t">
                        <td className="p-3">{train.trainNumber}</td>
                        <td className="p-3">{train.departureStation}</td>
                        <td className="p-3">{train.arrivalStation}</td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(train.departureTime).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-700 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(train.arrivalTime).toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">{train.platform}</td>
                        <td
                          className={`p-3 font-medium ${
                            train.status === "on time"
                              ? "text-green-600"
                              : train.status === "delayed"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {train.status}
                        </td>
                        <td className="p-3 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPopupMode("edit")
                              setSelectedTrain(train)
                              setPopupOpen(true)
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedTrain(train)
                              setDeletePopupOpen(true)
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No trains found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <SchedulePopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        mode={popupMode}
        train={selectedTrain}
      />

      <ConfirmDeletePopup
        open={deletePopupOpen}
        onClose={() => setDeletePopupOpen(false)}
        onConfirm={() => {
          handleDeleteSchedule(selectedTrain.id)
        }}
        trainNumber={selectedTrain?.trainNumber}
      />
    </>
  )
}
