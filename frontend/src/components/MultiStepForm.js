"use client";

import { useState } from 'react';

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    location: '',
    venue: '',
    hiringCategory: '',
    categoryDetails: {}
  });

  const nextStep = () => {
    // Validate Step 1 before moving
    if (step === 1) {
      if (!formData.eventName || !formData.eventType || !formData.eventDate || !formData.location || !formData.hiringCategory) {
        alert("Please fill in all required fields (marked with *).");
        return;
      }
      
      // Initialize categoryDetails based on selection, if not already set
      if (Object.keys(formData.categoryDetails).length === 0) {
         if (formData.hiringCategory === 'Event Planner') {
           setFormData({ ...formData, categoryDetails: { planningType: '', estimatedGuests: '', budget: '' } });
         } else if (formData.hiringCategory === 'Performer') {
           setFormData({ ...formData, categoryDetails: { genre: '', setDuration: '', equipment: '' } });
         } else if (formData.hiringCategory === 'Crew') {
           setFormData({ ...formData, categoryDetails: { role: '', shiftTimings: '', experience: '' } });
         }
      }
    }
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (val) => {
    // Reset category details when changing category
    let initialDetails = {};
    if (val === 'Event Planner') initialDetails = { planningType: '', estimatedGuests: '', budget: '' };
    else if (val === 'Performer') initialDetails = { genre: '', setDuration: '', equipment: '' };
    else if (val === 'Crew') initialDetails = { role: '', shiftTimings: '', experience: '' };
    
    setFormData(prev => ({ 
      ...prev, 
      hiringCategory: val,
      categoryDetails: initialDetails
    }));
  };

  const handleCategoryFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      categoryDetails: {
        ...prev.categoryDetails,
        [name]: value
      }
    }));
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:5000/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (resp.ok) {
        setSubmitSuccess(true);
      } else {
        alert('Error submitting to backend.');
      }
    } catch (error) {
      alert('Network error. Is the backend running?');
    }
    setLoading(false);
  };

  if (submitSuccess) {
    return (
      <div className="form-container step-container" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#10b981' }}>Success!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Your requirement has been posted successfully and saved to the database categorised under <strong>{formData.hiringCategory}</strong>.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Post Another</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="step-indicator">
         <div className={`step ${step >= 1 ? 'completed' : ''}`}>1</div>
         <div className={`step ${step >= 2 ? (step === 2 ? 'active' : 'completed') : ''}`}>2</div>
         <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>
      
      <div className="form-header">
         <h2>{step === 1 ? 'Event Basics' : step === 2 ? 'Specific Details' : 'Review & Submit'}</h2>
         <p>{step === 1 ? 'Start by telling us about your event' : step === 2 ? `Fields customized for ${formData.hiringCategory}` : 'Ensure everything looks correct before submitting'}</p>
      </div>

      {step === 1 && (
        <div className="step-container">
          <div className="input-row">
            <div className="input-group">
              <label>Event Name *</label>
              <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} placeholder="e.g. Summer Music Fest 2026" />
            </div>
            <div className="input-group">
              <label>Event Type *</label>
              <input type="text" name="eventType" value={formData.eventType} onChange={handleInputChange} placeholder="e.g. Festival, Corporate, Wedding" />
            </div>
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <label>Date or Date Range *</label>
              <input type="text" name="eventDate" value={formData.eventDate} onChange={handleInputChange} placeholder="e.g. Aug 10 - Aug 12, 2026" />
            </div>
            <div className="input-group">
              <label>Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. Los Angeles, CA" />
            </div>
          </div>

          <div className="input-group">
            <label>Venue Description (Optional)</label>
            <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} placeholder="e.g. Open air stadium, capacity 5000" />
          </div>

          <div className="input-group">
            <label>What are you hiring for? *</label>
            <div className="category-cards">
              <div 
                className={`category-card ${formData.hiringCategory === 'Event Planner' ? 'selected' : ''}`}
                onClick={() => handleCategoryChange('Event Planner')}>
                <div className="category-icon">📋</div>
                <div className="category-title">Event Planner</div>
              </div>
              <div 
                className={`category-card ${formData.hiringCategory === 'Performer' ? 'selected' : ''}`}
                onClick={() => handleCategoryChange('Performer')}>
                <div className="category-icon">🎸</div>
                <div className="category-title">Performer</div>
              </div>
              <div 
                className={`category-card ${formData.hiringCategory === 'Crew' ? 'selected' : ''}`}
                onClick={() => handleCategoryChange('Crew')}>
                <div className="category-icon">🛠️</div>
                <div className="category-title">Crew</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-container">
          {formData.hiringCategory === 'Event Planner' && (
            <>
              <div className="input-group">
                <label>Planning Type</label>
                <select name="planningType" value={formData.categoryDetails?.planningType || ''} onChange={handleCategoryFieldChange}>
                  <option value="">Select planning type...</option>
                  <option value="Full Service">Full Service</option>
                  <option value="Partial Planning">Partial Planning</option>
                  <option value="Day-of Coordination">Day-of Coordination</option>
                </select>
              </div>
              <div className="input-group">
                <label>Estimated Guests</label>
                <input type="number" name="estimatedGuests" value={formData.categoryDetails?.estimatedGuests || ''} onChange={handleCategoryFieldChange} placeholder="e.g. 150" />
              </div>
              <div className="input-group">
                <label>Budget Range</label>
                <input type="text" name="budget" value={formData.categoryDetails?.budget || ''} onChange={handleCategoryFieldChange} placeholder="e.g. $5k - $10k" />
              </div>
            </>
          )}

          {formData.hiringCategory === 'Performer' && (
            <>
              <div className="input-group">
                <label>Genre / Style</label>
                <input type="text" name="genre" value={formData.categoryDetails?.genre || ''} onChange={handleCategoryFieldChange} placeholder="e.g. Rock band, Jazz quartet, Magician" />
              </div>
              <div className="input-group">
                <label>Required Set Duration</label>
                <input type="text" name="setDuration" value={formData.categoryDetails?.setDuration || ''} onChange={handleCategoryFieldChange} placeholder="e.g. 2 hours" />
              </div>
              <div className="input-group">
                <label>Equipment / Backline needed at venue</label>
                <textarea rows="3" name="equipment" value={formData.categoryDetails?.equipment || ''} onChange={handleCategoryFieldChange} placeholder="e.g. Need PA system and mics provided"></textarea>
              </div>
            </>
          )}

          {formData.hiringCategory === 'Crew' && (
            <>
              <div className="input-group">
                <label>Crew Role</label>
                <input type="text" name="role" value={formData.categoryDetails?.role || ''} onChange={handleCategoryFieldChange} placeholder="e.g. Sound Technician, Lighting Engineer, Stagehand" />
              </div>
              <div className="input-group">
                <label>Shift Timings</label>
                <input type="text" name="shiftTimings" value={formData.categoryDetails?.shiftTimings || ''} onChange={handleCategoryFieldChange} placeholder="e.g. 2PM - 10PM" />
              </div>
              <div className="input-group">
                <label>Required Experience Level</label>
                <select name="experience" value={formData.categoryDetails?.experience || ''} onChange={handleCategoryFieldChange}>
                   <option value="">Select experience level...</option>
                   <option value="Junior / Assistant">Junior / Assistant</option>
                   <option value="Mid-Level">Mid-Level</option>
                   <option value="Senior / Lead">Senior / Lead (5+ years)</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="step-container" style={{ background: 'rgba(0,0,0,0.03)', padding: '20px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--primary-color)' }}>{formData.eventName}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '0.9rem' }}>
            <div><strong style={{color: 'var(--text-muted)'}}>Type:</strong> {formData.eventType}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Date:</strong> {formData.eventDate}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Location:</strong> {formData.location}</div>
            <div><strong style={{color: 'var(--text-muted)'}}>Venue:</strong> {formData.venue || 'N/A'}</div>
          </div>
          
          <hr style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />
          <h4 style={{ marginBottom: '12px', color: 'var(--text-main)' }}>Hiring: {formData.hiringCategory}</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
             {Object.entries(formData.categoryDetails).map(([key, val]) => (
                <div key={key}>
                  <strong style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {val || 'Not provided'}
                </div>
             ))}
          </div>
        </div>
      )}

      <div className="btn-group">
        {step > 1 ? (
          <button className="btn btn-secondary" onClick={prevStep} disabled={loading}>Back</button>
        ) : <div></div>}

        {step < 3 ? (
          <button className="btn btn-primary" onClick={nextStep}>Next Step</button>
        ) : (
          <button className="btn btn-primary" onClick={submitForm} disabled={loading}>
            {loading ? 'Submitting...' : 'Confirm & Submit'}
          </button>
        )}
      </div>

    </div>
  );
}
