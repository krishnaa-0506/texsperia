import { useState } from 'react';
import { CheckCircle, Upload, Users, User } from 'lucide-react';
import { day1Events, day2Events } from './EventsSection';
import { insertRegistration } from '../lib/mongodb';
import { uploadScreenshotToImageKit } from '../lib/imagekit';

interface EventDetails {
  eventId: string;
  eventName: string;
  teamName?: string;
  numberOfMembers?: number;
  memberNames?: string;
  teamLeaderPhone?: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    collegeName: '',
    department: '',
    participationDay: ''
  });

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [eventDetails, setEventDetails] = useState<Record<string, EventDetails>>({});
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const events = formData.participationDay === 'day1' ? day1Events : day2Events;

  const handleEventToggle = (eventId: string, eventName: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId));
      const newDetails = { ...eventDetails };
      delete newDetails[eventId];
      setEventDetails(newDetails);
    } else {
      const isAMIdeathon = eventId === 'am_ideathon';
      const hasAMIdeathon = selectedEvents.includes('am_ideathon');
      const otherEventCount = selectedEvents.filter(id => id !== 'am_ideathon').length;

      // If selecting AM Ideathon and already have 3 other events
      if (isAMIdeathon && otherEventCount >= 3 && !hasAMIdeathon) {
        setError('Please remove some other events first. You can select AM Ideathon + 3 other events');
        setTimeout(() => setError(''), 3000);
        return;
      }

      // If selecting a non-AM event and already have AM + 3 others
      if (!isAMIdeathon && hasAMIdeathon && otherEventCount >= 3) {
        setError('You already have AM Ideathon + 3 other events. Remove one first.');
        setTimeout(() => setError(''), 3000);
        return;
      }

      // If selecting a non-AM event and already have 3 other events (without AM)
      if (!isAMIdeathon && !hasAMIdeathon && otherEventCount >= 3) {
        setError('You can select a maximum of 3 events (or AM Ideathon + 3 other events)');
        setTimeout(() => setError(''), 3000);
        return;
      }

      setSelectedEvents([...selectedEvents, eventId]);
      setEventDetails({
        ...eventDetails,
        [eventId]: {
          eventId,
          eventName
        }
      });
    }
  };

  const handleEventDetailChange = (eventId: string, field: string, value: string | number) => {
    // Validate numberOfMembers against event limits
    if (field === 'numberOfMembers') {
      const event = events.find(e => e.id === eventId);
      const numValue = parseInt(value as string);
      
      if (event && event.minMembers != null && event.maxMembers != null && (numValue < event.minMembers || numValue > event.maxMembers)) {
        setError(`Members must be between ${event.minMembers} and ${event.maxMembers} for ${event.name}`);
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    setEventDetails({
      ...eventDetails,
      [eventId]: {
        ...eventDetails[eventId],
        [field]: value
      }
    });
  };

  const calculateTotalAmount = () => {
    const hasAMIdeathon = selectedEvents.includes('am_ideathon');
    const otherSelectedEvents = selectedEvents.filter(id => id !== 'am_ideathon');

    // AM Ideathon cost: ₹400 × team members
    let amIdeathonCost = 0;
    if (hasAMIdeathon) {
      const amMembers = eventDetails['am_ideathon']?.numberOfMembers || 1;
      amIdeathonCost = amMembers * 400;
    }

    // Other events cost: ₹400 × max team size
    let otherEventsCost = 0;
    let maxTeamMembers = 0;
    let hasIndividualEvents = false;

    otherSelectedEvents.forEach(eventId => {
      const event = events.find(e => e.id === eventId);
      if (event?.type === 'Individual') {
        hasIndividualEvents = true;
      } else {
        const members = eventDetails[eventId]?.numberOfMembers || 1;
        maxTeamMembers = Math.max(maxTeamMembers, members);
      }
    });

    const totalParticipants = maxTeamMembers > 0 ? maxTeamMembers : (hasIndividualEvents ? 1 : 0);
    otherEventsCost = totalParticipants * 400;

    return amIdeathonCost + otherEventsCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (selectedEvents.length === 0) {
      setError('Please select at least one event');
      setIsSubmitting(false);
      return;
    }

    if (!upiTransactionId) {
      setError('Please enter UPI Transaction ID');
      setIsSubmitting(false);
      return;
    }

    if (!paymentScreenshot) {
      setError('Please upload payment screenshot');
      setIsSubmitting(false);
      return;
    }

    for (const eventId of selectedEvents) {
      const event = events.find(e => e.id === eventId);
      // Skip team details check for Individual events (including AM Ideathon)
      if (event?.type !== 'Individual') {
        const details = eventDetails[eventId];
        if (!details?.teamName || !details?.numberOfMembers || !details?.memberNames || !details?.teamLeaderPhone) {
          setError(`Please fill all team details for ${event?.name}`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      setError(''); // Clear any previous errors
      setUploadStatus('');
      
      // Upload screenshot to ImageKit
      let screenshotUrl = '';
      if (paymentScreenshot) {
        setUploadStatus('Compressing and uploading payment screenshot...');
        screenshotUrl = await uploadScreenshotToImageKit(paymentScreenshot, `REG_${Date.now()}`);
        setUploadStatus('Upload complete! Saving registration...');
      }

      const maxTeamMembers = Math.max(
        0,
        ...selectedEvents
          .map(eventId => {
            const event = events.find(e => e.id === eventId);
            return event?.type !== 'Individual' ? (eventDetails[eventId]?.numberOfMembers || 1) : 0;
          })
          .filter(m => m > 0)
      );

      const hasIndividualEvents = selectedEvents.some(eventId => {
        const event = events.find(e => e.id === eventId);
        return event?.type === 'Individual';
      });

      const totalParticipants = maxTeamMembers > 0 ? maxTeamMembers : (hasIndividualEvents ? 1 : 0);

      const registrationData = {
        full_name: formData.fullName,
        mobile_number: formData.mobileNumber,
        email: formData.email,
        college_name: formData.collegeName,
        department: formData.department,
        participation_day: formData.participationDay,
        selected_events: selectedEvents.map(eventId => ({
          ...eventDetails[eventId],
          eventType: events.find(e => e.id === eventId)?.type
        })),
        total_participants: totalParticipants,
        payment_amount: calculateTotalAmount(),
        upi_transaction_id: upiTransactionId,
        payment_screenshot_url: screenshotUrl
      };

      // Save to MongoDB
      const result = await insertRegistration(registrationData);

      if (!result.success) throw new Error('Failed to save registration');

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error:', err);
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="register" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Registration Successful!</h2>
            <p className="text-xl text-gray-300 mb-6">
              Thank you for registering for TEXPERIA 2026 – MMCT Events.
            </p>
            <p className="text-gray-400">
              Our team will contact you shortly with further details.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
            >
              Register Another Participant
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Register Now</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {uploadStatus && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-300 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              {uploadStatus}
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">Personal Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Email ID *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">College Name *</label>
                <input
                  type="text"
                  required
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-semibold">Department *</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">Participation Day</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, participationDay: 'day1' });
                  setSelectedEvents([]);
                  setEventDetails({});
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.participationDay === 'day1'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 bg-gray-900 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl font-bold text-white mb-2">Day 1</div>
                <div className="text-gray-400">Technical Events</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, participationDay: 'day2' });
                  setSelectedEvents([]);
                  setEventDetails({});
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.participationDay === 'day2'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 bg-gray-900 hover:border-gray-500'
                }`}
              >
                <div className="text-2xl font-bold text-white mb-2">Day 2</div>
                <div className="text-gray-400">Skill & Strategy Events</div>
              </button>
            </div>
          </div>

          {formData.participationDay && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Select Events
              </h3>
              {selectedEvents.includes('am_ideathon') && (
                <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <p className="text-blue-300 font-semibold mb-2">ℹ️ Separate Event Notice</p>
                  <p className="text-sm text-blue-200">
                    <strong>AM Ideathon (National Level)</strong> is a separate standalone event. You will pay separately for this event (₹400 per team member).
                  </p>
                </div>
              )}
              <p className="text-gray-400 mb-6">
                {selectedEvents.includes('am_ideathon') 
                  ? `You have selected: AM Ideathon (National Level) + ${selectedEvents.filter(id => id !== 'am_ideathon').length} of 3 other events`
                  : `You have selected ${selectedEvents.length} of 3 events`
                }
              </p>
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-300 font-semibold mb-2">💰 Pricing Structure</p>
                <ul className="text-sm text-green-200 space-y-1">
                  <li><strong>AM Ideathon:</strong> ₹400 per team member (billed separately)</li>
                  <li><strong>Other 5 Events:</strong> ₹400 per person covers ALL selected events (select any 3)</li>
                </ul>
                <p className="text-xs text-green-200 mt-2">
                  Example: Team of 4 selecting Innoventure + CAD Design = ₹1,600 total (covers both events)
                </p>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                <strong>Note:</strong> If you select an individual event (like CAD Design) along with a team event, all team members will be registered individually for that event.
              </p>

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id}>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedEvents.includes(event.id)
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-600 bg-gray-900 hover:border-gray-500'
                      }`}
                      onClick={() => handleEventToggle(event.id, event.name)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => {}}
                              className="w-5 h-5 accent-yellow-500"
                            />
                            <h4 className="text-xl font-bold text-white">{event.name}</h4>
                            {event.type === 'Individual' ? (
                              <User className="w-5 h-5 text-gray-400" />
                            ) : (
                              <Users className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-8">
                            <p className="text-sm text-gray-400">
                              {event.type === 'Individual' 
                                ? 'Individual Event' 
                                : `Team ${event.minMembers ? `(${event.minMembers}-${event.maxMembers} members)` : ''}`}
                            </p>
                            {event.type === 'Individual' && selectedEvents.some(id => {
                              const e = events.find(evt => evt.id === id);
                              return e?.type !== 'Individual' && id !== event.id;
                            }) && (
                              <p className="text-xs text-blue-300 mt-1">
                                ℹ️ All team members from your group events will be registered individually
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedEvents.includes(event.id) && event.type !== 'Individual' && (
                      <div className="mt-4 ml-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <h5 className="text-lg font-bold text-yellow-400 mb-4">
                          {event.id === 'am_ideathon' ? 'Team Details (Individual Registration with Team Option)' : 'Team Details'}
                        </h5>

                        <div className="grid md:grid-cols-2 gap-4">
                          {event.id !== 'am_ideathon' && (
                            <div className="md:col-span-2">
                              <label className="block text-gray-300 mb-2">Team Name *</label>
                              <input
                                type="text"
                                required
                                value={eventDetails[event.id]?.teamName || ''}
                                onChange={(e) => handleEventDetailChange(event.id, 'teamName', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-gray-300 mb-2">
                              {event.id === 'am_ideathon' ? 'Team Size (1-4 members)' : `Number of Members (${event.minMembers}-${event.maxMembers})`} *
                            </label>
                            <input
                              type="number"
                              required
                              min={event.minMembers}
                              max={event.maxMembers}
                              value={eventDetails[event.id]?.numberOfMembers || ''}
                              onChange={(e) => handleEventDetailChange(event.id, 'numberOfMembers', parseInt(e.target.value))}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2">
                              {event.id === 'am_ideathon' ? 'Team Coordinator Phone' : 'First Person / Coordinator Phone'} *
                            </label>
                            <input
                              type="tel"
                              required
                              pattern="[0-9]{10}"
                              value={eventDetails[event.id]?.teamLeaderPhone || ''}
                              onChange={(e) => handleEventDetailChange(event.id, 'teamLeaderPhone', e.target.value)}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-gray-300 mb-2">Member Names (comma separated) *</label>
                            <textarea
                              required
                              rows={2}
                              value={eventDetails[event.id]?.memberNames || ''}
                              onChange={(e) => handleEventDetailChange(event.id, 'memberNames', e.target.value)}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                              placeholder="John Doe, Jane Smith, ..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedEvents.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Payment Details</h3>

              <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-gray-300 mb-2">Total Amount</p>
                  <p className="text-5xl font-bold text-yellow-400">₹{calculateTotalAmount()}</p>
                  <div className="text-sm text-gray-400 mt-4 space-y-2">
                    {selectedEvents.includes('am_ideathon') && (
                      <p>
                        <strong>AM Ideathon (Separate):</strong> <span className="text-yellow-300">₹{(eventDetails['am_ideathon']?.numberOfMembers || 1) * 400}</span> 
                        <span className="text-xs ml-2">({eventDetails['am_ideathon']?.numberOfMembers || 1} member{(eventDetails['am_ideathon']?.numberOfMembers || 1) !== 1 ? 's' : ''} × ₹400)</span>
                      </p>
                    )}
                    {selectedEvents.filter(id => id !== 'am_ideathon').length > 0 && (
                      <>
                        <p className="border-t border-yellow-500/30 pt-2">
                          <strong>Other Events (₹400/person for all selected):</strong> 
                          <span className="text-yellow-300 ml-2">₹{(() => {
                            const otherEvents = selectedEvents.filter(id => id !== 'am_ideathon');
                            let maxTeams = 0;
                            let hasIndiv = false;
                            otherEvents.forEach(eventId => {
                              const event = events.find(e => e.id === eventId);
                              if (event?.type === 'Individual') {
                                hasIndiv = true;
                              } else {
                                maxTeams = Math.max(maxTeams, eventDetails[eventId]?.numberOfMembers || 1);
                              }
                            });
                            const count = maxTeams > 0 ? maxTeams : (hasIndiv ? 1 : 0);
                            return count * 400;
                          })()}</span>
                        </p>
                        <div className="text-xs text-gray-500 ml-4">
                          {selectedEvents.filter(id => id !== 'am_ideathon').map(eventId => {
                            const event = events.find(e => e.id === eventId);
                            return (
                              <p key={eventId}>• {event?.name}</p>
                            );
                          })}
                        </div>
                      </>
                    )}
                    <p className="text-yellow-400 font-semibold mt-3 border-t border-yellow-500/30 pt-2 text-xs">
                      {selectedEvents.includes('am_ideathon') && '✓ AM Ideathon billed separately'}
                      {selectedEvents.includes('am_ideathon') && selectedEvents.filter(id => id !== 'am_ideathon').length > 0 && <br />}
                      {selectedEvents.filter(id => id !== 'am_ideathon').length > 0 && '✓ Other events: single payment covers all selected events'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-6">
                <h4 className="text-lg font-bold text-white mb-4">Scan QR Code to Pay</h4>
                <div className="flex flex-col items-center">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-400 mb-2">Payee: <span className="text-white font-semibold">Hari Krishnaa</span></p>
                    <p className="text-sm text-gray-400">UPI ID: <span className="text-yellow-400 font-semibold">krishnaahari05@okicici</span></p>
                  </div>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <img src="/qr.jpeg" alt="UPI Payment QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-gray-400 text-sm text-center">Scan with Google Pay, PhonePe, Paytm, or any UPI app</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">UPI Transaction ID *</label>
                  <input
                    type="text"
                    required
                    value={upiTransactionId}
                    onChange={(e) => setUpiTransactionId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                    placeholder="Enter your UPI transaction ID"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Upload Payment Screenshot *</label>
                  <label className="flex items-center gap-2 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white cursor-pointer hover:border-yellow-500 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="flex-1 truncate">
                      {paymentScreenshot ? paymentScreenshot.name : 'Choose file'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Check file size (max 5MB)
                          const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                          if (file.size > maxSize) {
                            setError('File size must be less than 5MB. Please compress or resize your image.');
                            e.target.value = ''; // Reset input
                            return;
                          }
                          setPaymentScreenshot(file);
                          setError(''); // Clear any previous errors
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || selectedEvents.length === 0}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg shadow-yellow-500/50 disabled:shadow-none"
          >
            {isSubmitting ? (uploadStatus || 'Processing...') : 'Complete Registration'}
          </button>
        </form>
      </div>
    </section>
  );
}
