import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApi } from "@/lib/api"
import { useScheduleStore } from "@/store/scheduleStore"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Label } from "../ui/label"

interface TrainSchedule {
  id: number
  trainNumber: string
  departureStation: string
  arrivalStation: string
  departureTime: string
  arrivalTime: string
  platform: number
  status: string
}

interface SchedulePopupProps {
  open: boolean
  onClose: () => void
  mode: "create" | "edit"
  train?: TrainSchedule
}

export function SchedulePopup({ open, onClose, mode, train }: SchedulePopupProps) {
  const { createSchedule, updateSchedule } = useApi()
  const { addTrain, updateTrain } = useScheduleStore()

  const [form, setForm] = useState<Omit<TrainSchedule, "id">>({
    trainNumber: "",
    departureStation: "",
    arrivalStation: "",
    departureTime: "",
    arrivalTime: "",
    platform: 1,
    status: "on time",
  })

  useEffect(() => {
    if (mode === "edit" && train) {
      setForm({
        trainNumber: train.trainNumber,
        departureStation: train.departureStation,
        arrivalStation: train.arrivalStation,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        platform: train.platform,
        status: train.status,
      })
    } else {
      setForm({
        trainNumber: "",
        departureStation: "",
        arrivalStation: "",
        departureTime: "",
        arrivalTime: "",
        platform: 1,
        status: "on time",
      })
    }
  }, [mode, train])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === "platform" ? Number(value) : value })
  }

  const handleSubmit = async () => {
    try {
      if (mode === "create") {
        const response = await createSchedule(form)
        addTrain(response.data)
      } else if (mode === "edit" && train) {
        const response = await updateSchedule(train.id, form)
        updateTrain(train.id, response.data)
      }
      onClose()
    } catch (err) {
      console.error("Failed to save schedule:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Train" : "Edit Train"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
                <Label htmlFor="trainNumber">Train Number</Label>
                <Input
                id="trainNumber"
                name="trainNumber"
                placeholder="Train number"
                value={form.trainNumber}
                onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <Label htmlFor="departureStation">Departure Station</Label>
                <Input
                id="departureStation"
                name="departureStation"
                placeholder="Departure station"
                value={form.departureStation}
                onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <Label htmlFor="arrivalStation">Arrival Station</Label>
                <Input
                id="arrivalStation"
                name="arrivalStation"
                placeholder="Arrival station"
                value={form.arrivalStation}
                onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                id="departureTime"
                type="datetime-local"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                id="arrivalTime"
                type="datetime-local"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <Label htmlFor="platform">Platform</Label>
                <Input
                id="platform"
                type="number"
                name="platform"
                placeholder="Platform"
                value={form.platform}
                onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <Label htmlFor="status">Status</Label>
                <Select
                value={form.status}
                onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, status: value }))
                }
                >
                <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="on time">On Time</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {mode === "create" ? "Add" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
