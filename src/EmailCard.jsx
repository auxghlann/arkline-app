// src/EmailCard.jsx

const getUrgencyData = (urgency) => {
  switch (urgency?.toLowerCase()) {
    case "high":
      return { color: "text-red-600", emoji: "🔴" };
    case "medium":
      return { color: "text-orange-500", emoji: "🟠" };
    case "low":
    default:
      return { color: "text-green-600", emoji: "🟢" };
  }
};



export default function EmailCard({ email }) {
  const { color, emoji } = getUrgencyData(email.urgency);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border mb-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{emoji}</span>
        <span className={`font-semibold capitalize ${color}`}>
          {email.urgency} Urgency
        </span>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          <strong>Sender:</strong> {email.sender}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Subject:</strong> {email.subject}
        </p>
        <p className="text-sm mt-1">{email.message}</p>
      </div>
    </div>
  );
}
