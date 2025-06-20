import { useState } from 'react';
import axios from 'axios';

const SubmissionPortal = () => {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);

  const submit = async () => {
    const formData = new FormData();
    formData.append('text', text);
    if (photo) formData.append('photo', photo);
    if (audio) formData.append('audio', audio);

    try {
      await axios.post('http://localhost:5000/api/submissions', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-cosmic-black text-nebula-white p-6">
      <h2 className="text-3xl font-celestial text-stellar-gold">Submit Reflection</h2>
      <textarea value={text} onChange={e => setText(e.target.value)} className="bg-space-black p-2 mt-2 w-full text-nebula-white" />
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="bg-space-black p-2 mt-2 w-full" />
      <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files[0])} className="bg-space-black p-2 mt-2 w-full" />
      <button onClick={submit} className="bg-stellar-gold text-cosmic-black p-2 mt-2">Submit</button>
    </div>
  );
};

export default SubmissionPortal;