import { useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL;

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ personality: {}, mood: '', emotionalNeeds: [] });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const submitProfile = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/onboard`, profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (step === 1) return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Personality Assessment</h2>
      <input placeholder="Openness (0-1)" onChange={e => setProfile({ ...profile, personality: { ...profile.personality, openness: e.target.value } })} className="bg-space-black p-2 mt-2 w-full" />
      <input placeholder="Extraversion (0-1)" onChange={e => setProfile({ ...profile, personality: { ...profile.personality, extraversion: e.target.value } })} className="bg-space-black p-2 mt-2 w-full" />
      <button onClick={nextStep} className="bg-stellar-gold text-cosmic-black p-2 mt-2">Next</button>
    </div>
  );

  if (step === 2) return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Mood Assessment</h2>
      <select onChange={e => setProfile({ ...profile, mood: e.target.value })} className="bg-space-black p-2 mt-2 w-full">
        <option value="">Select Mood</option>
        <option value="Romantic">Romantic</option>
        <option value="Dreamy">Dreamy</option>
        <option value="Hopeful">Hopeful</option>
        <option value="Neutral">Neutral</option>
        <option value="Sad">Sad</option>
        <option value="Stressed">Stressed</option>
      </select>
      <button onClick={prevStep} className="bg-cosmic-purple text-nebula-white p-2 mt-2 mr-2">Back</button>
      <button onClick={nextStep} className="bg-stellar-gold text-cosmic-black p-2 mt-2">Next</button>
    </div>
  );

  if (step === 3) return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Emotional Needs</h2>
      <input placeholder="e.g., love, peace" onChange={e => setProfile({ ...profile, emotionalNeeds: e.target.value.split(',') })} className="bg-space-black p-2 mt-2 w-full" />
      <button onClick={prevStep} className="bg-cosmic-purple text-nebula-white p-2 mt-2 mr-2">Back</button>
      <button onClick={() => { submitProfile(); setStep(4); }} className="bg-stellar-gold text-cosmic-black p-2 mt-2">Submit</button>
    </div>
  );

  return <p className="text-nebula-white">Onboarding Complete!</p>;
};

export default Onboarding;