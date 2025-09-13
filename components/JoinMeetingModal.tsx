"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

// Zod schema for join meeting form validation
const joinMeetingSchema = z.object({
  zoomId: z.string().min(1, "Zoom ID is required"),
  username: z.string().min(1, "Username is required"),
})

type JoinMeetingFormData = z.infer<typeof joinMeetingSchema>

interface JoinMeetingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JoinMeetingModal({ isOpen, onClose }: JoinMeetingModalProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinMeetingFormData>({
    resolver: zodResolver(joinMeetingSchema),
  })

  const onSubmit = async (data: JoinMeetingFormData) => {
    console.log("Join meeting data:", data)
    console.log("🚀 Joining meeting and starting call automatically...")
    
    // Navigate to the WebRTC call page with meeting info
    const params = new URLSearchParams({
      zoomId: data.zoomId,
      username: data.username
    })
    router.push(`/call?${params.toString()}`)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Meeting</DialogTitle>
          <DialogDescription>
            Enter the Zoom meeting ID and your username to join the meeting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="zoomId">Zoom Meeting ID</Label>
              <Input
                id="zoomId"
                placeholder="123 456 789"
                {...register("zoomId")}
                className={errors.zoomId ? "border-red-500" : ""}
              />
              {errors.zoomId && (
                <p className="text-sm text-red-500">{errors.zoomId.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                placeholder="John Doe"
                {...register("username")}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join & Start Call"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
