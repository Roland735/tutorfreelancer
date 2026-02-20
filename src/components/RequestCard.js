import { useState } from "react";
import { FaMapMarkerAlt, FaMoneyBillWave, FaUser, FaCheckCircle, FaStar } from "react-icons/fa";

export default function RequestCard({ request, currentUser, onAction }) {
  const [reviewForm, setReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isRequester = currentUser?.id === request.requester?._id;
  const isTutor = currentUser?.role === "tutor";
  const isAssignedTutor = request.tutor && currentUser?.id === request.tutor._id;

  const handleReviewSubmit = () => {
    onAction(request._id, "review", { rating, comment });
    // Assume success for now, ideally wait for parent but this is simpler
    // Or parent will refresh data
  };

  const handleComplete = () => {
    // First complete, then review? Or both at once.
    // The API /api/reviews checks if request is completed.
    // So we should first complete the request, then review.
    // Actually, let's just complete it first.
    // Wait, my API for review requires request to be completed.
    // So the flow should be:
    // 1. User clicks "Complete & Review" -> Calls COMPLETE API.
    // 2. Then calls REVIEW API.
    // Or simply, "Complete" button first. Then "Review" button appears.

    // Let's make "Complete" button first.
    onAction(request._id, "complete");
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg hover:border-emerald-500/50 transition flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-emerald-500">{request.topic}</h3>
        <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${request.status === 'open' ? 'bg-blue-900 text-blue-300' :
          request.status === 'accepted' ? 'bg-yellow-900 text-yellow-300' :
            'bg-emerald-900 text-emerald-300'
          }`}>
          {request.status}
        </span>
      </div>

      <p className="text-gray-300 mb-4 flex-grow">{request.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <FaMoneyBillWave className="text-emerald-500" />
          <span>${request.budget}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-emerald-500" />
          <span>{request.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaUser className="text-emerald-500" />
          <span>{request.requester?.name || "Unknown"}</span>
        </div>
        {request.tutor && (
          <div className="flex items-center gap-1 text-emerald-400">
            <FaUser />
            <span>Tutor: {request.tutor.name || "Unknown"}</span>
          </div>
        )}
      </div>

      {request.status === 'completed' && request.review && (
        <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < request.review.rating ? "text-yellow-400" : "text-gray-600"} />
              ))}
            </div>
            <span className="text-sm text-gray-400">Review</span>
          </div>
          <p className="text-gray-300 italic text-sm">"{request.review.comment}"</p>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-800">
        {request.status === 'open' && isTutor && (
          <button
            onClick={() => onAction(request._id, "accept")}
            className="w-full bg-gray-800 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-2 px-4 rounded transition border border-emerald-900 hover:border-emerald-600"
          >
            Offer Help
          </button>
        )}

        {request.status === 'accepted' && isRequester && (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleComplete}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Mark as Completed
            </button>
          </div>
        )}

        {request.status === 'completed' && isRequester && !reviewForm && !request.review && (
          <button
            onClick={() => setReviewForm(true)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Write a Review
          </button>
        )}

        {reviewForm && (
          <div className="bg-gray-800 p-4 rounded mt-2">
            <h4 className="text-sm font-bold mb-2">Rate & Review</h4>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <textarea
              className="w-full bg-gray-900 text-white p-2 rounded text-sm mb-2"
              placeholder="How was the session?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleReviewSubmit}
                className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700"
              >
                Submit
              </button>
              <button
                onClick={() => setReviewForm(false)}
                className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
