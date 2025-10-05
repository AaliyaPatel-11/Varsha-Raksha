// src/components/EmergencyHelp.jsx

const EmergencyHelp = () => {
  // Data for emergency contacts
  const contacts = [
    { name: 'National Emergency Number', number: '112', emoji: '🚨' },
    { name: 'Police', number: '100', emoji: '🚓' },
    { name: 'Fire', number: '101', emoji: '🔥' },
    { name: 'Ambulance', number: '108', emoji: '🚑' },
    { name: 'Disaster Management (GHMC)', number: '040-21111111', emoji: '🏛️' },
    { name: 'Women Helpline', number: '1091', emoji: '👩' },
  ];

  return (
    <div className="page-container">
      <h2>Emergency Help & Contacts</h2>
      <p>Tap a number to call. Stay safe.</p>
      <div className="contact-list">
        {contacts.map((contact) => (
          <a key={contact.name} href={`tel:${contact.number}`} className="contact-card">
            <div className="contact-emoji">{contact.emoji}</div>
            <div className="contact-details">
              <span className="contact-name">{contact.name}</span>
              <span className="contact-number">{contact.number}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EmergencyHelp;