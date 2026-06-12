import { useState } from "react";

interface AttemptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating?: number, notes?: string) => void;
}

export default function AttemptModal({
    isOpen,
    onClose,
    onSubmit,
}: AttemptModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [notes, setNotes] = useState("");

    const handleSubmit = () => {
        onSubmit(rating, notes);
        setRating(5);
        setNotes("");
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 max-w-md mx-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Registrar intento
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            ¿Qué tal salió?
                        </label>
                        <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="text-3xl transition-colors"
                                    type="button"
                                >
                                    {star <= rating ? "★" : "☆"}
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            {rating} de 5 estrellas
                        </p>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Notas (opcional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={4}
                            placeholder="¿Qué cambios hiciste? ¿Qué mejoró? ¿Qué no salió bien?"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={onClose}
                            type="button"
                            className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="flex-1 py-2 px-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
