import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { 
 
  User, 
  Phone, 
  Mail, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  Instagram,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import './App.css'

interface TimeSlot {
  time: string
  available: boolean
}

const timeSlots: TimeSlot[] = [
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '12:00 PM', available: false },
  { time: '1:00 PM', available: true },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: true },
  { time: '4:00 PM', available: true },
  { time: '5:00 PM', available: true },
  { time: '6:00 PM', available: true },
]

const service = {
  name: 'Home Service Haircut',
  description: 'Classic or modern cut with consultation',
  price: '₱200',
  duration: '45 min'
}

function App() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })

  const handleTimeSelect = (time: string) => setSelectedTime(time)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = () => { if (step < 3) setStep(step + 1) }
  const handleBack = () => { if (step > 1) setStep(step - 1) }

  const canProceed = () => {
    switch (step) {
      case 1: return selectedDate !== undefined && selectedTime !== null
      case 2: return formData.name && formData.phone && formData.address
      default: return true
    }
  }

  const handleSubmit = async () => {
    const booking = {
      service: service.name,
      date: selectedDate?.toLocaleDateString(),
      time: selectedTime,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address
    }

    // Save locally
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    bookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(bookings))

    // Send EmailJS notification
    try {
      await emailjs.send(
        'service_6phlies',      // from EmailJS dashboard
        'template_c4teshr',    // booking template
        booking,
        '0WinIIkCf2ePfaWwy'       // EmailJS public key
      )
      alert('Booking confirmed! Email notification sent.')
    } catch (err) {
      console.error(err)
      alert('Booking saved but email failed.')
    }

    // Reset form
    setSelectedDate(undefined)
    setSelectedTime(null)
    setFormData({ name: '', phone: '', email: '', address: '' })
    setStep(1)
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img 
          src="/hero-barber.jpg" 
          alt="Bloom Fades Barbershop" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-neutral-950" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
            Bloom <span className="text-amber-500">Fades</span>
          </h1>
          <p className="text-neutral-300 text-lg md:text-xl mb-4">Home Service Barber</p>
          <div className="flex items-center gap-4 text-neutral-400 text-sm flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Magalang, Pampanga, Philippines
            </span>
            <a 
              href="https://instagram.com/bloomfades" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-amber-500 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @bloomfades
            </a>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 -mt-8 relative z-10">
        <Card className="bg-neutral-900 border-neutral-800 shadow-2xl">
          <CardHeader className="border-b border-neutral-800 pb-4">
            <CardTitle className="text-white text-xl">Book Your Appointment</CardTitle>
            {/* Step numbers removed */}
          </CardHeader>

          <CardContent className="pt-6">
            {/* Service Info Card */}
            <div className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Home className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">{service.name}</p>
                  <p className="text-neutral-400 text-sm">{service.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-500 font-bold text-xl">{service.price}</p>
                  <p className="text-neutral-500 text-sm">{service.duration}</p>
                </div>
              </div>
            </div>

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Select Date</h3>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="bg-neutral-800 rounded-lg border border-neutral-700"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Select Time</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all",
                            !slot.available && "opacity-50 cursor-not-allowed bg-neutral-800/50",
                            selectedTime === slot.time
                              ? "border-amber-500 bg-amber-500 text-black"
                              : slot.available && "border-neutral-700 bg-neutral-800 text-white hover:border-neutral-600"
                          )}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Customer Info */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-neutral-300">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Juan Dela Cruz"
                        className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-neutral-300">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0912 345 6789"
                        className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-neutral-300">Email (optional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="juan@example.com"
                        className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-neutral-300">Home Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Barangay, Street, House Number, Magalang, Pampanga"
                        className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Review Your Booking</h3>
                <div className="bg-neutral-800 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-neutral-400">Service</span>
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-neutral-400">Price</span>
                    <span className="text-amber-500 font-semibold">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-neutral-400">Duration</span>
                    <span className="text-white">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-neutral-400">Date</span>
                    <span className="text-white">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-neutral-400">Time</span>
                    <span className="text-white">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-neutral-400">Name</span>
                    <span className="text-white">{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
                    <span className="text-neutral-400">Phone</span>
                    <span className="text-white">{formData.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Address</span>
                    <span className="text-white text-right max-w-[60%]">{formData.address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-neutral-800">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-neutral-700 text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  Confirm Booking
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-neutral-500 text-sm">
          <p className="mb-2">Home Service Only • Open Tue-Sat 9AM-7PM</p>
          <p>For questions, DM us on Instagram <a href="https://instagram.com/bloomfades" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">@bloomfades</a></p>
        </div>
      </div>
    </div>
  )
}

export default App